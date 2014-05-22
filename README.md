## Klotski game via js canvas

![what klotski looks like](https://farm6.staticflickr.com/5491/13933588087_01571368ea_m_d.jpg)
(img [via flickr](https://www.flickr.com/photos/18099895@N06/13933588087))

Currently: Solve a sliding block puzzle by moving the red block to the marked area. _I J K L_ move the cursor. _W A S D_ drags the cursor & the shape beneath it, when the way is clear. Prints test results to the console (so debugging doesn't work with IE; Opera needs different termin.log() output.)

### intended evolution

* ~~draw board & pieces~~
* ~~draw cursor~~
* ~~move cursor with arrow keys~~
* ~~move piece with wasd~~
* ~~check win condition~~
* ~~move cursor with ijkl instead~~
* tests for everything 3/7(+10?)
* ~~move count; smarter move count~~
* save & restore game (anticheating?)
* solver for hints?
* win sound?

Released under [MIT license](http://opensource.org/licenses/MIT). You know, because I [didn't invent](http://en.wikipedia.org/wiki/Klotski) klotski.