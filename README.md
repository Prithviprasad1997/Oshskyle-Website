# Oshskyle Logistics

Seven-page static website. Edit the HTML in public/ and shared styles and navigation in public/site/. Preview with python3 -m http.server 8000 --directory public. Netlify publishes public/ without a build command.

## HBL tracking
The Netlify function at /.netlify/functions/hbl reads the Freight OS PostgreSQL schema. Set FREIGHT_TRACKING_DATABASE_URL (TLS-enabled, read-only, preferably pooled) and FREIGHT_TRACKING_COMPANY_ID (the Oshskyle company UUID) in the hosting environment. Never put either in public files. Grant SELECT only on the required bills_of_lading, jobs and milestones columns. Use Netlify Dev for an integrated preview; a plain static server cannot execute functions. After deployment, test one issued HBL, one unknown reference and one draft. Events reflect actual milestones entered in Freight OS, not vessel GPS.
