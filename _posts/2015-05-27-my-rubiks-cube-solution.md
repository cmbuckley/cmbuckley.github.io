---
title: My Rubik's Cube Solution
description: A number of people have been solving Rubik's cubes at work recently.
layout: post
categories:
  - Academic
  - Play
image:
  meta:
    src: /files/2015/05/2-fl.png
    alt: Rubik's cube with finished first layer
last_modified_at: 2021-08-25 10:38 +01:00
---
A number of people have been solving Rubik's cubes at work recently, and although there are numerous guides out there I can't seem to find one that matches my approach for every step.

## Intro: Terminology

A Rubik's cube is made up of a number of different pieces, or cubies. There are 3 types: a corner piece (with 3 stickers), an edge piece (with 2 stickers), and a fixed centre piece. All centre pieces are fixed relative to each other, and the corner and edge pieces move around them.

Each of the faces has a name, depending on how the cube is being held: The _**F**_ (front) and _**B**_ (back) faces, where _**F**_ faces the solver. The _**L**_ (left) and _**R**_ (right) faces are clear, and the _**U**_ (up) and _**D**_ (down) faces are top and bottom of the cube respectively.

Each face can move in 2 directions: clockwise and anti-clockwise. Clockwise is always relative to looking at the face, not from the view of the solver. A clockwise move is denoted by the face letter, so _**F**_ rotates the front face clockwise. An anti-clockwise move is the letter followed by a prime symbol, such as _**F′**_. A double turn (i.e. 180°) is denoted by a letter followed by the number 2, such as _**F2**_.

## Step 1: The Cross

I choose white as the starting colour. My recommendation is to figure out the first layer (steps 1--2) without using the instructions, but I've created some basic ones just in case. The key is to match the colours relative to the other centre pieces. In all these isometric views below, the left-hand face of the diagram is the _**F**_ face, making the right-hand face the _**R**_ face.

{% include figure.html img="/files/2015/05/1-centres.png" alt="Rubik's cube with only the centre pieces coloured." caption="The starting position. Green is _**F**_, so should face you when you solve these moves." %}
{% include figure.html img="/files/2015/05/1-f-.png" alt="Rubik's cube denoting centre pieces and first layer cross. The front face is rotated a quarter turn clockwise." caption="_**F′**_" %}
{% include figure.html img="/files/2015/05/1-u-ru.png" alt="Rubik's cube denoting centre pieces and first layer cross. The front face is rotated a quarter turn clockwise, and the white/green piece is flipped." caption="_**U′ R U**_" %}
{% include figure.html img="/files/2015/05/1-cross.png" alt="Rubik's cube with centre pieces and first-layer edge pieces coloured." caption="The finished cross." %}

## Step 2: First Layer Corners

Once you have the cross, fill in the corner cubies to match. First, look for an unsolved white corner in the bottom layer, and place it below where it's meant to be in the top layer. If there aren't any, you can just move one out of the top layer using any of these moves. As with before, the left-hand face of the picture is _**F**_.

{% include figure.html img="/files/2015/05/2-fdf-.png" alt="Rubik's cube with centre pieces and first-layer edge pieces coloured. The red/green/white corner piece is on the bottom layer with green on the bottom face." caption="_**F D F′**_" %}
{% include figure.html img="/files/2015/05/2-r-d-r.png" alt="Rubik's cube with centre pieces and first-layer edge pieces coloured. The red/green/white corner piece is on the bottom layer with red on the bottom face." caption="_**R′ D′ R**_" %}
{% include figure.html img="/files/2015/05/2-r-d2rdr-d-r.png" alt="Rubik's cube with centre pieces and first-layer edge pieces coloured. The red/green/white corner piece is on the bottom layer with white on the bottom face." caption="_**R′ D2 R D R′ D′ R**_" %}
{% include figure.html img="/files/2015/05/2-fl.png" alt="Rubik's cube with centre pieces and all first-layer pieces coloured." caption="The finished layer." %}

## Step 3: Middle Layer

Now that you have the first layer complete, flip the cube upside-down so it's on the bottom. The next step solves the four edge cubies in the middle layer. In the diagrams, the left-hand face is always _**F**_.

As with step 2, look for an edge in the top layer to move down into the middle layer. If there isn't one, just swap one out from the middle layer.

This is where my approach differs from most guides I've found. The moves are 1 turn shorter, but the starting position isn't as easy to explain. Line the edge up above the appropriate centre piece, so that the colour _on top_ matches the centre piece. There are two possible moves, which are mirror images of each other.

{% include figure.html img="/files/2015/05/3-f-u2l-ulu2f.png" alt="Rubik's cube with centre pieces and first layer coloured, and the red/green edge piece is shown on the top face with green next to the red centre." caption="_**F′ U2 L′ U L U2 F**_ (Red is _**F**_)" %}
{% include figure.html img="/files/2015/05/3-ru2bu-b-u2r-.png" alt="Rubik's cube with centre pieces and first layer coloured, and the red/green edge piece is shown on the top face with red next to the green centre." caption="_**R U2 B U′ B′ U2 R′**_" %}

If you have an edge in its correct position but the wrong orientation, you can either swap it out and back in using the moves above, or you can use the following shortcut:

{% include figure.html img="/files/2015/05/3-2ru2fr2f-u2r-ur-.png" alt="Rubik's cube with centre pieces and first layer coloured, and the red/green edge piece is in the correct position in the middle layer with the wrong orientation." caption="_**R2 U2 F R2 F′ U2 R′ U R′**_" %}

## Step 4: Corner Permutations

You should now have the first two layers, with the final layer unsolved. The last layer is the reverse of the first layer --- solve the corner cubes first and then the cross --- but in each case, you need to sort out the permutations of the pieces separately from the orientations.

At this point, I flip the cube over again so the white face is on top, but I'll often be glancing at the bottom face to see what stage it's at. All the diagrams in the next steps assume you're looking at the cube as follows:

{% include figure.html img="/files/2015/05/4-faces.png" alt="Rubik's cube with labelled faces for final layer" %}

First, pick one of the corner cubies to be in the right place. If one of them is in the correct orientation (e.g. yellow is correctly on the yellow face), then pick that one, as it'll save time in the next step. There are only two outcomes (the first 2 are mirrors of each other). Note also that flipping the back 2 cubies is almost identical to the second permutation of 3 cubies, with a leading _**D**_ move.

{% include figure.html img="/files/2015/05/4-lb-r-bl-b-rb.png" alt="Top layer of Rubik's cube with 3 corner pieces needing to move in an anti-clockwise rotation." caption="_**L D′ R′ D L′ D′ R D**_" %}
{% include figure.html img="/files/2015/05/4-r-blb-rbl-b-.png" alt="Top layer of Rubik's cube with 3 corner pieces needing to move in a clockwise rotation." caption="_**R′ D L D′ R D L′ D′**_" %}
{% include figure.html img="/files/2015/05/4-br-blb-rbl-b.png" alt="Top layer of Rubik's cube with 2 corner pieces needing to switch places." caption="_**D R′ D L D′ R D L′ D**_" %}

## Step 5: Corner Orientations

This step orients all the last layer corner cubies so that they all have the yellow face to match the centre cubes. There are only 2 algorithms, and again they are mirrors of each other.

{% include figure.html img="/files/2015/05/5-lbl-blb2l-b2.png" alt="Top layer of Rubik's cube with 3 corner pieces needing to orient clockwise so that yellow is on the top." caption="_**L D L′ D L D2 L′ D2**_" %}
{% include figure.html img="/files/2015/05/5-r-b-rb-r-b2rb2.png" alt="Top layer of Rubik's cube with 3 corner pieces needing to orient anti-clockwise so that yellow is on the top." caption="_**R′ D′ R D′ R′ D2 R D2**_" %}

All other possibilities can be reduced to these examples with various applications of the same algorithms, so it's worth playing with these to see which move results in which outcome. A couple of others are quickly solved:

{% include figure.html img="/files/2015/05/5-3.png" alt="Top layer of Rubik's cube with 2 corner pieces correctly oriented, and 2 with yellow on the front face." caption="Put the 2 correct corners at the back, then perform both algorithms from this step." %}
{% include figure.html img="/files/2015/05/5-4.png" alt="Top layer of Rubik's cube with 2 corner pieces correctly oriented, and 2 with yellow on the left/right faces." caption="Put the 2 correct corners at the back, then perform the first algorithm from the left, and the second algorithm from the right." %}

## Step 6: Edge Permutations

This step will repeat the permutation performed in step 4, but for the edges instead of the corners. As with all these later steps, there are a much more limited number of positions that the cube can be in at this point. Again, there are only 2 algorithms, and again they are mirror images of each other, but we will use a slightly different notation here.

Here, _**V**_ refers to the vertical slice between the _**L**_ and _**R**_ faces. The orientation of the _**V**_ moves should be considered the same as looking from the right-hand side, so a _**V**_ move rotates the middle slice upwards, and a _**V′**_ move rotates the middle slice downwards. The smoothest way to perform a _**V**_ move is to hold the _**L**_ face still and rotate _**V**_ and _**R**_ together, then rotate _**R**_ back.

{% include figure.html img="/files/2015/05/6-v-b-vb2v-b-v.png" alt="Top layer of Rubik's cube with 3 edge pieces needing to move in an anti-clockwise rotation." caption="_**V′ D′ V D2 V′ D′ V**_" %}
{% include figure.html img="/files/2015/05/6-v-bvb2v-bv.png" alt="Top layer of Rubik's cube with 3 edge pieces needing to move in a clockwise rotation." caption="_**V′ D V D2 V′ D V**_" %}

## Step 7: Edge Orientations

This final step will orient the edges and complete the cube. The last algorithm also has a mirror image, but the same can be achieved by simply rotating the cube. The move is the lengthiest in 16 steps, but the last 8 are just a repeat of the first 8.

{% include figure.html img="/files/2015/05/7.png" alt="Top layer of Rubik's cube with 2 edge pieces needing to flip their orientation." caption="_**V′ D′ V D′ V′ D2 V D2 V′ D′ V D′ V′ D2 V D2**_" %}
