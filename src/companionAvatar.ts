import { pixelFigure, type PixelAvatarRecipe } from '@botharness/pixel-avatar';
/** Same rig as the editor; omit its tile/backplate, as BotHarness's companion surface does. */
export function companionAvatarSvg(recipe: PixelAvatarRecipe): string {
  const yaw = { front: 0, left: -25, right: 25 }[recipe.pose];
  const figure = pixelFigure(recipe, yaw);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" shape-rendering="crispEdges">${figure.body}${figure.head}</svg>`;
}
