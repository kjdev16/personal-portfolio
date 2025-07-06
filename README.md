# Personal Portfolio

## GitHub Snake Game Integration

This portfolio includes a fun animated snake game generated from your GitHub contribution grid!

- The snake game is created using the [Platane/snk GitHub Action](https://github.com/marketplace/actions/generate-snake-game-from-github-contribution-grid).
- The workflow runs daily and updates the SVG animation in the `output/` directory.
- The animation is displayed on the GitHub Repositories page, showing a snake eating through your contribution squares.

### How it works
- The workflow is defined in `.github/workflows/generate-snake.yml`.
- It generates two SVGs: one for light mode and one for dark mode.
- The SVGs are loaded dynamically on the portfolio site using a `<picture>` element for theme support.

**Enjoy your interactive GitHub contribution snake game!** 