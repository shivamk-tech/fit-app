/**
 * Google Sign-In configuration.
 *
 * GOOGLE_WEB_CLIENT_ID: the OAuth client of type "Web application" from
 * Google Cloud Console → APIs & Services → Credentials. It is used on both
 * platforms; the ID token Google returns is issued for this client, so the
 * backend verifies tokens against it.
 *
 * Android additionally needs an OAuth client of type "Android" for package
 * `com.fitrewards` with the signing key's SHA-1 (no ID goes in code).
 *
 * GOOGLE_IOS_CLIENT_ID: the OAuth client of type "iOS" for bundle ID
 * `org.reactjs.native.example.fitrewards` (or whatever the Xcode bundle ID is).
 * Its reversed form must also be added as a URL scheme in ios/fitrewards/Info.plist.
 */

// TODO: add the iOS client ID once the iOS OAuth client exists.
export const GOOGLE_WEB_CLIENT_ID =
  '986943460349-pv0fsfjkg6cv0780smt8spiq9iieii2k.apps.googleusercontent.com';
export const GOOGLE_IOS_CLIENT_ID = '';

export const isGoogleConfigured = (): boolean =>
  GOOGLE_WEB_CLIENT_ID.length > 0;
