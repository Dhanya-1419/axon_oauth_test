import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const apiKey = process.env.DATABRICKS_API_KEY;
    const workspaceUrl = process.env.DATABRICKS_WORKSPACE_URL;

    if (!apiKey) {
      return NextResponse.json({ 
        error: "Databricks API key not configured. Please set DATABRICKS_API_KEY environment variable." 
      }, { status: 401 });
    }

    if (!workspaceUrl) {
      return NextResponse.json({ 
        error: "Databricks workspace URL not configured. Please set DATABRICKS_WORKSPACE_URL environment variable." 
      }, { status: 401 });
    }

    // Test clusters endpoint
    const clustersResponse = await fetch(`${workspaceUrl}/api/2.0/clusters/list`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!clustersResponse.ok) {
      return NextResponse.json({ 
        error: "Databricks API request failed",
        status: clustersResponse.status,
        statusText: clustersResponse.statusText
      }, { status: clustersResponse.status });
    }

    const clustersData = await clustersResponse.json();

    // Test jobs endpoint
    const jobsResponse = await fetch(`${workspaceUrl}/api/2.1/jobs/list`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    let jobs = [];
    if (jobsResponse.ok) {
      const jobsData = await jobsResponse.json();
      jobs = jobsData.jobs || [];
    }

    // Test notebooks endpoint
    const notebooksResponse = await fetch(`${workspaceUrl}/api/2.0/workspace/list`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: "/" }),
    });

    let notebooks = [];
    if (notebooksResponse.ok) {
      const notebooksData = await notebooksResponse.json();
      notebooks = notebooksData.objects || [];
    }

    return NextResponse.json({
      success: true,
      workspace: {
        url: workspaceUrl,
        api_key_available: !!apiKey,
      },
      clusters_summary: {
        total_count: clustersData.clusters?.length || 0,
        active_clusters: clustersData.clusters?.filter(c => c.state === 'RUNNING').length || 0,
        recent_clusters: (clustersData.clusters || []).slice(0, 3).map(cluster => ({
          cluster_id: cluster.cluster_id,
          cluster_name: cluster.cluster_name,
          state: cluster.state,
          num_workers: cluster.num_workers,
          driver_node_type_id: cluster.driver_node_type_id,
        })),
      },
      jobs_summary: {
        total_count: jobs.length,
        recent_jobs: jobs.slice(0, 3).map(job => ({
          job_id: job.job_id,
          settings: job.settings?.name,
          created_time: job.created_time,
          creator_user_name: job.creator_user_name,
        })),
      },
      notebooks_summary: {
        total_count: notebooks.length,
        recent_notebooks: notebooks.slice(0, 3).map(notebook => ({
          object_id: notebook.object_id,
          object_type: notebook.object_type,
          path: notebook.path,
          modified_at: notebook.modified_at,
        })),
      },
      api_info: {
        provider: "Databricks",
        api_version: "2.0",
        workspace_url: workspaceUrl,
      }
    });

  } catch (error) {
    console.error("Databricks test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
