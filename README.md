# Anthony's Graduation Invitation

A dependency-free static invitation site ready for GitHub Pages.

## Publish

1. Create a GitHub repository and add these files.
2. In the repository, open **Settings → Pages**.
3. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.

## Connect the RSVP database

The RSVP form uses Formspree, which stores responses in an easy-to-use online dashboard:

1. Create a free form at [formspree.io](https://formspree.io).
2. Copy the form ID from the endpoint Formspree gives you, such as `xyzabcde`.
3. In `script.js`, replace `YOUR_FORM_ID` with that ID.

Guests will then submit directly from the invitation, and responses will appear in your Formspree dashboard.
