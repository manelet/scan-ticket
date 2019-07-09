#!/bin/bash
# convert $1 -colorspace Gray ./output.jpg
# convert $1 -fuzz 10% -fill Red -opaque White ./output.png
# convert $1 -fill white -fuzz 15% +opaque "#000000" ./output.png

# convert $1 -rotate "180" \( -clone 0 -blur 0x5 \) +swap -compose divide -composite ./output2.png

convert $1 -auto-orient -rotate '90' ./output.png
sh /Users/manel/Desktop/textcleaner -f 25 -o 5 -T -p 20 -t 50 -u -e stretch ./output.png ./output2.png

# convert $1 -auto-orient -morphology close square:1 ./output2.pngz

# convert $1 -fuzz 50%% -fill Black -floodfill 0x0 White ./output.png
# convert ./output.png -morphology Hit-and-Miss "1x8:1,0,1,1,0,0,0,0" ./output2.png
# mogrify -normalize -level 10%,90% -sharpen 0x1 $1

# convert $1 -auto-orient ./output.png
# convert $1 \( -clone 0 -blur 0x5 \) +swap -compose divide -composite ./output2.png
tesseract ./output2.png stdout -l spa+cat
open ./output2.png
