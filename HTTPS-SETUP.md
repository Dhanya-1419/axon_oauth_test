# HTTPS Setup for OAuth

## 🔐 HTTPS Required Services

Some OAuth providers require HTTPS for security:

### **Calendly** 
- **Required:** HTTPS redirect URI
- **Redirect URI:** `https://localhost:3000/api/oauth/callback/calendly`
- **OAuth URL:** `https://localhost:3000/api/oauth/start/calendly`

## 🛠️ Setup HTTPS for Local Development

### **Option 1: Use Next.js with HTTPS**
```bash
# Install mkcert for local SSL certificates
npm install -g mkcert
mkcert create-ca
mkcert create-cert

# Start Next.js with HTTPS
npm run dev -- --experimental-https
```

### **Option 2: Use ngrok (Recommended)**
```bash
# Install ngrok
npm install -g ngrok

# Start ngrok for port 3000
ngrok http 3000

# Update .env.local with ngrok URL
NEXTAUTH_URL=https://your-ngrok-url.ngrok.io
```

### **Option 3: Use Cloudflare Tunnel**
```bash
# Install cloudflared
npm install -g cloudflared

# Start tunnel
cloudflared tunnel --url http://localhost:3000
```

## 📋 Update Calendly App Settings

In your Calendly developer console:
1. Go to https://app.calendly.com/developer
2. Select your app
3. Update **Redirect URL(s)** to:
   ```
   https://localhost:3000/api/oauth/callback/calendly
   ```
   (or your ngrok/cloudflare URL if using tunnels)

## 🧪 Testing HTTPS OAuth

### **With ngrok:**
```bash
# Start ngrok
ngrok http 3000

# Update .env.local
NEXTAUTH_URL=https://abc123.ngrok.io

# Test Calendly OAuth
curl -X GET https://abc123.ngrok.io/api/oauth/start/calendly
```

### **With local HTTPS:**
```bash
# Start with HTTPS
npm run dev -- --experimental-https

# Test Calendly OAuth
curl -X GET https://localhost:3000/api/oauth/start/calendly
```

## ⚠️ Important Notes

- **Calendly** requires HTTPS for OAuth redirects
- **Other services** (ClickUp, Asana, Figma) work with HTTP for local development
- **Production** should always use HTTPS
- **Browser security** may block mixed HTTP/HTTPS content

## 🎯 Quick Fix for Testing

If you just want to test Calendly quickly:

1. **Use ngrok:**
   ```bash
   ngrok http 3000
   # Copy the https://...ngrok.io URL
   ```

2. **Update .env.local:**
   ```bash
   NEXTAUTH_URL=https://your-ngrok-url.ngrok.io
   ```

3. **Update Calendly app:**
   - Add redirect URL: `https://your-ngrok-url.ngrok.io/api/oauth/callback/calendly`

4. **Test:**
   ```bash
   curl -X GET https://your-ngrok-url.ngrok.io/api/oauth/start/calendly
   ```

This will give you a secure HTTPS URL for Calendly OAuth testing! 🚀
