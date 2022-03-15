# Assignment #1 - Mood Jorts


## Notes from Student to Grader

** *When you hand in the assignment, replace this sentence with a short intro to your project-to-be-graded.  Include comments on what grading target you believe you have achieved.* **


## Introduction

This is your second assignment for grades.

In this assignment, you will demonstrate your ability to make a front-end-only single page app, using the skills of Unit 2.  This app has no need to write back-end code, although I've provided a minimalist stub so that you can `npm run dev` if you like (because that's how I prefer to work).

I expect that in this project there will be no need to use any libraries.  If you want to use a library to solve a major problem, don't.  If you want to use a library to improve a triviality, ask me.

In particular, we are making a "mood board".  I was going to name it "Jood board", like J for Jeremy, but that name just bothered me, so it's going to be called "Mood Jorts".  Jorts are pretty cool.

(If you can think of an even dumber name than "mood jorts", you're welcome to rename your project.)


## Due Dates

I don't know, was the check-in due date helpful last time?  Let's try it without that this time, and once we've tried both ways, you can tell me whether it was helpful.

Checkin: **Monday March 21st, by class**

Due Date: **Saturday March 26th, 11pm**

That's over a week of non-Spring-Break time, plus if you want to use some of your Spring Break, feel free.


## Intellectual Honesty

I am revising my policy relative to last semester.  You may not use code from other students, and you may not share your code solutions with other students.  You may discuss, in the abstract, approaches to problems, including advice on what web pages were worth consulting.  A rule of thumb is, if you're looking at someone else's code, it's probably not okay, but if you're just talking out loud it's probably okay, and chat over Discord is a grey area.  You may also ask me, your instructor, for help.

You may use code that you find online.  A more traditional professor would require you to cite all sources from which you take code.  I will simply strongly recommend it.  The reason is this: if a few students have the same erroneous code, it looks like intellectual dishonesty, but if it turns out they used the same wrong source, that helps me to understand it as a simple error.  So for that reason, there is a file in this project called sources.txt, into which I recommend you copy the URLs of web pages from which you copy code.


## Grading

There are four possible grades for this assignment.  They're like difficulty levels.

* Fail
    * By the way, if you fail the assignment then you fail the course.
* Pass (55%)
    * To Pass, you must complete 100% of the requirements listed to Pass.
* Satisfactory (75%)
    * To get a Satisfactory grade, you must complete 100% of the requirements listed for Satisfactory (as well as the requirements for Pass).
* Exemplary (something higher)
    * To get an Exemplary grade, you must complete all of the requirements for Satisfactory and Pass, and then some of the Exemplary requirements

So all the specific requirements, listed below, are organized according to the difficulty level.


### Late Penalties

For assignment submissions that would normally earn only a Pass, there will be no late penalties (though at some point, for reasons of my sanity, I'll set a cut-off, probably 4 weeks late).  This is to ensure that students who understand the material can pass the course.

For assignment submissions that would normally earn a grade higher than a pass, there will be some late penalties, and also a cut-off.



## Requirements, organized by Grade

### PASS

For this level, the web-app must be in a state to demo, to impress a client.

* Header
    * There must be a header.  The header must contain a name, and an "Add Image" button.  Mine also contains a settings icon, that's optional.
    * The Add Image icon must open a form, with an input available to put in a URL, and buttons to Confirm (or Add) and Cancel
        * This dialog must not be hidden behind other UI elements
        * This dialog must do nothing if the input is empty and the Add button is pressed
        * When an image is added, create a new card and add it to the end of the list of cards
* Main view
    * The main part of the page must contain zero or more cards.
        * It may start empty, but ideally you would random-seed with a few sample images.
            * If you do random-seed, it should be clear in your code how I would comment out that section.
    * Each card is the host for an image, and in normal view the card displays only the image, with no other UI elements
    * Cards are displayed in a particular order, and initially they are displayed in the order they are added
* Cards
    * When not in editing mode, a card shows only its image
    * Clicking on a card will toggle it to or from editing mode
        * Also toggling one card to editing mode takes all other cards out of editing mode.
    * When in editing mode, a card shows the image at a smaller size, plus some editing buttons
        * there's a delete button
            * I really should have designed and implemented some system for confirming deletion, maybe you'd like to do a better job than me on this
        * there are two buttons to move the card earlier or later in the order
        * there are two buttons to increase or decrease the size of the card
    * cards must have some type of "size" property, which can be varied (as mentioned above)
        * in my implementation, this size property is in multiples of 30px
            * if varying this slightly allows you to make a nice-looking app, that's fine, but don't stray too far
        * there should be lower and upper bounds on how small or large a card can get (in my case, 60px to 270px)
    * all card-edit button functionality must be implemented with delegates (or one delegate), so that there are not hundreds of active event listeners
        * my solution has less than ten event listeners at the PASS level, but the exact number isn't important
        * but if I add ten more pictures, and that adds 50 more listeners, that's not okay
* CSS
    * Your CSS must be at least as nice as mine.  This isn't really a class on CSS, but I know you all passed a class on CSS, and I know that you will be required to do CSS in the future, so...  
        * When making the demo version of this, I spent more time on CSS than on everything else put together.  You may find yourself doing the same.  That's normal.  Some people say CSS isn't as "hard" as JS, and there's some truth to that, but it's not easy either, and it can be a fair bit of work.
    * I have included about 50% of the CSS I used in my solution.  You may use it, or replace it, or whatever you wish.


So, in short, you must be able to

* add images
* resize images
* move images
* delete images

That will require you to

* select DOM nodes
* create DOM nodes
* modify DOM nodes
* delete DOM nodes


#### Code organization

This is just like last assignment.

I expect your code to be perfectly readable, e.g. perfect indentation, perfect spacing, etc.  "Format Document" is built right into VS Code, and other editors have similar options.  I will overlook one or two errors, but not many.

I expect your variable names to be vaguely reasonable.  An example of unreasonable is a variable with a name that is lies about what's in it (e.g. the variable is called `post` but it always contains an array of multiple posts, or a variable called `post_id` that contains a user ID).  Also unreasonable is a variable that is super vague when there's an obvious less-vague name (e.g. a variable called `info` when there's an obvious better alternative like `post_count` or `user_name`).

In general, I expect you to produce code that, if you were getting paid for it, I wouldn't take one look at it and go "holy hoops this person does not deserve this job".  I guess if you come to me and say "I do not want to be employable" I might grant an exemption on this, I'm just sort of *assuming* that you all want to be employable.


### SATISFACTORY

There are basically two extra requirements for SATISFACTORY: localStorage, and absolute-positioned cards

* absolute-positioned cards
    * add a new button to all cards (visble only in edit mode), that takes them out of the flow of the page, and makes them absolute-positioned
        * absolute-positioned cards should have a z-index above normal cards, but below the pop-over form for adding new cards
        * initially they could be either in the center of the screen, or else some other reasonable place, like maybe where they were before transitioning to absolute-positioning
    * absolute-positioned cards still obey the size rules, and can still be resized somehow
    * absolute-positioned cards no longer have a place in the order, and there should be no weird janky bugs related to this
    * absolute-positioned cards should have a button (in edit mode) to return them to normal flow
        * this puts them AT THE END of the existing normal-flow cards, as if it was a new image
    * absolute-positioned cards can also be moved
        * figure out a nice UI paradigm involving buttons
        * OR, go look at the EXEMPLARY tier
* localStorage
    * every single change made to the page should be recorded in localStorage, so that if I refresh the page, everything returns as it was
        * that includes what images are where, in what order, what size, and in the case of absolutely-positioned cards, where they're positioned


#### Code organization

This is just like last assignment.

So, you know how back at the Pass grading tier I said I was going to be completely intolerate of bad coding style?  Okay, maybe I exaggerated a bit.  But this time I'm not kidding.  Perfect, please.  You're not getting a grade higher than 55% if it hurts me just to read your code.  Better that I bitch you out than your first boss.




### EXEMPLARY

As before, EXEMPLARY requirements are not an all-or-nothing package deal.  Unlike before, they have different weights.  4 points is sufficient to upgrade your grade to 100%.  You cannot get more than 4 points here (i.e. the only way over 100% is the bonus listed below).


* keybinds (weight: 1)
    * modify the DOM properties so that TAB cycles through the existing cards
        * this does not require JS, except in the sense that you're doing everything with JS in this assignment
    * create a keybind such that, when a card is currently selected, and this key is pressed, that card goes into Edit mode
        * this is back to normal JS event handling, of course
    * for a card in edit mode, create keybinds for moving cards left, right, larger, and smaller
        * also normal JS events
        * this should work appropriately for both normal-flow cards and absolute-position cards
* undo/redo (weight: 1)
    * make all actions possible to be undo-ed and redo-ed
    * you'll add buttons to the header, I guess in the top-right corner, to activate these
    * a limit of 100 undos/redos is reasonable, if you want, or no limit is fine too
    * this should affect adding images, removing images, resizing/moving images, and switches to/from absolute positioning
        * I think that's everything, did I miss anything?
* draggable elements (weight: 2)
    * you've already got absolutely-positioned elements, and maybe they already can be moved
    * make them move by dragging
        * they can go anywhere now!   anywhere!
    * they can only be dragged when they're in edit mode, of course
    * no libraries
    * good luck
* SVG elements (weight: 2)
    * add an SVG-drawing capability, so that users can use SVG to mark up their mood board
    * it should allow at least the following types of shape:
        * circles, filled and unfilled
        * squares, filled and unfilled
        * poly-lines
        * unfilled closed poly-lines
        * filled closed polylines
    * there should be good color choices, either a general color-picker, or else a palette of several options
    * this is too hard for weight=2, but I don't care, but you've been warned, don't do this one









### BONUS

If there are errors or problems in the way I wrote up this assignment, the first student to identify the issue and communicate it to me may receive a bonus mark, probably 1%, depending on how serious I think the problem is.  First come, first served.
