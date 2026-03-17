import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get Google access token (shared with BigQuery)
    const googleAccessToken = process.env.GOOGLE_ACCESS_TOKEN;
    
    if (!googleAccessToken) {
      return NextResponse.json({ 
        error: "No Google access token available. Please authenticate with Google first." 
      }, { status: 401 });
    }

    // Test BigQuery API using Google access token
    // First, get the list of datasets
    const datasetsResponse = await fetch(`https://www.googleapis.com/bigquery/v2/projects`, {
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,
      },
    });

    if (!datasetsResponse.ok) {
      return NextResponse.json({ 
        error: "BigQuery API request failed",
        status: datasetsResponse.status,
        statusText: datasetsResponse.statusText,
        details: await datasetsResponse.text()
      }, { status: datasetsResponse.status });
    }

    const datasetsData = await datasetsResponse.json();
    const datasets = datasetsData.datasets || [];

    // Get details for first dataset if available
    let datasetDetails = null;
    if (datasets.length > 0) {
      const firstDatasetId = datasets[0].datasetReference.datasetId;
      const detailsResponse = await fetch(`https://www.googleapis.com/bigquery/v2/projects/${firstDatasetId}`, {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      });
      
      if (detailsResponse.ok) {
        datasetDetails = await detailsResponse.json();
      }
    }

    // Test a simple query if we have a dataset
    let queryResults = [];
    if (datasetDetails) {
      const query = `SELECT COUNT(*) as total_rows FROM \`${datasetDetails.datasetReference.datasetId}\`.INFORMATION_SCHEMA.TABLE_OPTIONS LIMIT 10`;
      const queryResponse = await fetch(`https://www.googleapis.com/bigquery/v2/projects/${datasetDetails.datasetReference.datasetId}/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          useLegacySql: false,
        }),
      });

      if (queryResponse.ok) {
        const queryData = await queryResponse.json();
        queryResults = queryData.rows || [];
      }
    }

    return NextResponse.json({
      success: true,
      bigquery_info: {
        datasets_count: datasets.length,
        datasets: datasets.slice(0, 3).map(dataset => ({
          id: dataset.id,
          friendlyName: dataset.friendlyName,
          datasetReference: dataset.datasetReference,
          location: dataset.location,
          created: dataset.created,
          modified: dataset.modified,
        })),
        current_dataset: datasetDetails ? {
          id: datasetDetails.id,
          friendlyName: datasetDetails.friendlyName,
          description: datasetDetails.description,
          location: datasetDetails.location,
          created: datasetDetails.created,
          modified: datasetDetails.modified,
          access: datasetDetails.access,
        } : null,
      },
      query_results: queryResults.slice(0, 3),
      token_info: {
        provider: "Google (shared with BigQuery)",
        token_available: !!googleAccessToken,
      }
    });

  } catch (error) {
    console.error("BigQuery test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
