export const TESTFLIGHT_URL = 'https://testflight.apple.com/join/sA9EznXr';
export const GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=app.deepseekbot.mobile';

const testFlight = new URL(TESTFLIGHT_URL);
const googlePlay = new URL(GOOGLE_PLAY_URL);

/** One delegated click event, for the Hero and Install sections; never includes an email. */
export function mobileInstallEvent(
  url: URL,
  placement: string,
): ['mobile_beta:install_link_click', Record<string, string>] | null {
  if (url.origin === testFlight.origin && url.pathname === testFlight.pathname)
    return [
      'mobile_beta:install_link_click',
      { platform: 'ios', destination: 'testflight', placement },
    ];
  const ids = url.searchParams.getAll('id');
  if (
    url.origin === googlePlay.origin &&
    url.pathname === googlePlay.pathname &&
    ids.length === 1 &&
    ids[0] === googlePlay.searchParams.get('id')
  )
    return [
      'mobile_beta:install_link_click',
      { platform: 'android', destination: 'google_play', placement },
    ];
  return null;
}
