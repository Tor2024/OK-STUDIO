# Security Specification - AURELIS / WEB STUDIO OK

## Data Invariants
1. A Project must have a valid title, category, and image URL.
2. An Insight must have a date and author.
3. Only authenticated admins can modify any data.
4. Public users can ONLY read projects and insights that are marked as "published" (if applicable) or all by default in this prototype.

## The Dirty Dozen Payloads (Targeting Rejection)
1. Anonymous user attempting to create a project.
2. Logged-in non-admin user attempting to delete a project.
3. Admin attempting to create a project without a title.
4. Admin attempting to create a project with a 2MB string in the title.
5. Malicious user spoofing `ownerId` in a project (though not used yet, good to test).
6. Admin attempting to update a project's `id` field (immutable).
7. User attempting to read private settings collection (if defined).
8. Admin setting `order` to a string instead of a number.
9. Malicious user trying to inject script tags into description.
10. Anonymous user trying to write to `settings`.
11. Authenticated user trying to list users (if collection existed).
12. Admin using a non-standard ID for a project (e.g. including special characters).

## Test Runner Logic
The `firestore.rules` will be verified against these cases using the logic gates:
- `isSignedIn()`
- `isAdmin()`
- `isValidProject()`
- `isValidInsight()`
- `isValidSetting()`
