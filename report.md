Deployment Support Request: Node.js Applications on Ecosnet cPanel

Date: November 18, 2025
To: Ecosnet Technical Support
From: leqta.com
Subject: Help Needed - Cannot Deploy Node.js Applications

## What I'm Trying to Deploy

I need to deploy two Node.js applications on my cPanel hosting:
- **Strapi CMS** (Backend/API)
- **Next.js Website** (Frontend)

Both applications need to run continuously on the server.

## The Problem

I'm completely stuck and cannot deploy my applications. Here's why:

### Issue 1: Cannot Build on the Server

When I try to run `npm install` or `npm run build` on the server, the process gets killed after a few seconds. 
The server appears to be terminating the process due to memory or CPU limits.

**What happens:**
- I run: `npm install` or `npm run build`
- Process starts but stops after a short time
- Error message: "Killed"

This means I cannot build my applications on the server.

### Issue 2: Cannot Install Packages (NPM Repository Blocked)

In a previous support ticket, I was informed that **connections to external servers outside Algeria (including npm repository) are forbidden** on this hosting environment.

This creates a major problem because Node.js applications require installing dependencies from the npm registry during the build process.

### Issue 3: Building Outside Server Causes Compatibility Problems

Since I cannot build on the server, I tried building the applications externally (on my computer or using GitHub Actions) and uploading the built files. However, this causes **binary compatibility issues** because:

- Node.js native modules are compiled for specific operating systems
- Building on Windows/Mac and deploying to Linux server causes errors
- Pre-compiled binaries from external builds may not work on your server architecture

### Issue 4: Node.js Applications Need Background Process Management

Node.js applications are not like PHP websites that run on-demand. They need to:
- Run continuously as background services
- Automatically restart if they crash

Typically, this requires process managers like **PM2** or **systemd**. Without a process manager,
the applications will stop if any error occurs.

**Does the cPanel Node.js interface support persistent background processes?**
## What I Need

I'm caught in an impossible situation:
1. Cannot build on server (resource limits kill the process)
2. Cannot download npm packages (external connections blocked)
3. Cannot build externally (compatibility issues)

**Please help me understand:**

1. **Can npm registry access be enabled?** Without access to npmjs.org, Node.js applications cannot be deployed at all.

2. **What is the recommended deployment method** for Node.js applications on this hosting environment given these restrictions?


I need to deploy this website urgently. Please advise on the proper way to deploy Node.js applications on your hosting platform.

Thank you for your assistance.