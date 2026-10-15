# Hostel Hub Deployment

The React frontend is published on GitHub Pages. The Express API is configured for Render and MongoDB Atlas through `render.yaml`.

## Atlas

1. Wait for the free `Cluster0` deployment to finish provisioning.
2. In **Database & Network Access**, create a database user with `readWrite` access to a database named `hostel_khojau`.
3. Add Render's outbound IP addresses to the Atlas IP access list. Do not commit or send the database URI or password in chat.
4. In Atlas, use **Connect > Drivers** to copy the Node.js connection string. Replace the password in Render's private environment settings, not in this repository.

## Render API

1. Open Render's Blueprint flow and select the `bikas15/Hostel-Khojau` repository.
2. Deploy the `hostel-khojau-api-bikas15` web service from `render.yaml`.
3. Enter the Atlas URI when Render asks for `MONGODB_URI`. Render generates `JWT_SECRET` automatically.
4. Wait for `/api/health` to report `{"status":"ok","database":"connected"}`.

The free Render service may sleep while idle. Its first request after sleeping can take a short time to respond.

Real Khalti payments additionally require the private `KHALTI_SECRET_KEY` and `KHALTI_GATEWAY_URL` values in Render. Do not put these values in GitHub Pages or frontend variables.

## Connect the Pages frontend

In GitHub, open **Hostel-Khojau > Settings > Secrets and variables > Actions > Variables** and add:

- Name: `VITE_API_BASE_URL`
- Value: `https://hostel-khojau-api-bikas15.onrender.com/api`

Then rerun the **Deploy Hostel Hub to GitHub Pages** workflow. The value is a public API address, not a credential.

The backend currently stores uploaded images on its local filesystem. Render's free filesystem is ephemeral, so use persistent object storage before relying on user-uploaded photos in production.