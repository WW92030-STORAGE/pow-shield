# ASSETS

Various assets and whatnot. Feel free to customize as needed.

## `splashes.txt`

The flavortext that appears when on the POW challenge page.

Each line is a separate random choice, picked uniformly with weighting. Comments and blank lines are ignored. Comments are lines that begin with two dashes `--`. <br/>

Lines that begin with exclamation points then bracketed integers e.g. `![16]` represent weights, the default is one (so `[16]` is sixteen times more likely to be picked than `![1]` or no listed weight). Weights are ignored.

## `wallpapers.dat` AND `./wallpapers/`

Wallpapers that can be displayed on the background of the loading page. The `.dat` file behaves similarly to `splashes.txt` except each functional line is a filename of a wallpaper and (optionally) its weight.

Wallpapers will be scaled to fit.