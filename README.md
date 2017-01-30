## Klotski via js canvas

![klotski stages](https://farm6.staticflickr.com/5481/14621883763_5620bf091e_z_d.jpg)
(img [via flickr](https://www.flickr.com/photos/18099895@N06/14621883763))

Solve the klotski (sliding block) puzzle by moving the red block to the marked area. _W A S D_ to move the cursor. Hold down _shift_ to move the shape beneath it, when the way is clear. Prints test results to the console (so debugging doesn't work with IE; Opera needs to replace termin.log() function).

Released under [MIT license](http://opensource.org/licenses/MIT). You know, because I [didn't invent](http://en.wikipedia.org/wiki/Klotski) klotski.

### Future directions

__Tests__  
Virtually nothing tests itself or is tested. Partly this stems from a non-functional orientation. Nevertheless, Board - serialize, deserialize, in_goal_area, swap_block, try_cursor, try_block, and all the internal functions still need confirming tests. Screen, mercifully, seems testable by eye.

__Invalid move__  
It could be cool to show when the cursor is trying to move in a direction it can't. I considered drawing a red bar that fades with a timer. But then I'd have to figure out the edge of the shape it's under in that direction.

__Wiki__  
I like the idea of [literate programming](http://en.literateprograms.org/Special:Contributions/Nzen). But, it is only appropriate after the program is done. I could enliterate this, but would probably refactor it again before I did.

__Hint system__  
I think there's one way of solving the puzzle, with symmetric variations. So, it is possible to have a solver [calculate the moves](http://www.treskal.com/kalle/klotski.pdf) (pdf) via a depth-first search. Then it could make a suggestion for the next move or something. What would be really fancy is a segmented arrow showing a four move path or something. Both sound like a lot of work.
