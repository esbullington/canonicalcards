# CanonicalCards

Review cards for core computer science subjects.  [Try it](http://esbullington.github.io/canonicalcards/)

### What is this?

#### tldr
An open source flashcard program to review canonical computer science algorithms, data structures, architectures, and techniques. It is *not* intended to teach these concepts, but rather to review them and (eventually) provide some sort of benchmark over time of the user's progress.

#### The long version
A recent [HN thread](https://news.ycombinator.com/item?id=8775375) discussed the fact that many programmers who come to the profession lack the shared vocabulary that programmers had in the past.

The reasons for this change are vast, but probably boil down to three issues:

1. The field is much broader, and continually expanding. Not everyone can make a living as a systems programming anymore.
2. Many programmers now work at a very high level of abstraction, and standard libraries are increasingly comprehensive.
2. Many programmers are career changers, and lack the formal computer science education most programmers used to have.

With this project, I hope to address a portion of this problem.  A site of comprehensive, open souce computer science flashcards could help learners to master the material.  So now, I need to build this site (partially done, in fact, an open source web app using React) and assemble the cards (a huge task!).

### What this is *not*
This is *not* intended to teach you all these basic computer science concepts.  For that, you'll need study on your own.  Coursera and EdX have some excellent CS courses and increasing number of high-quality textbooks are open source.  The goal is to include a brief explanation beside each answer, along with a set of links for in-depth self-study.

The flashcards are in the form of multiple choice, although I'm also working on a spaced repetition version.  I'll also probably expand the quiz to use self-reported answer results, so users don't have to see multiple choices if they don't want to when they answer.

### How you can help

First and foremost, I need help building up a set of flashcards that cover the core classes of a traditional computer science education.  For the sake of this project, we'll probably not go deep into upper-level or graduate-level classes, but rather the very foundation courses that most CS students take in their first and second years:

* Algorithms
* Data structures
* Theory of computer
* Programming languages
* Formal methods 

Because we have to draw the line somewhere, we're not particularly interested in applied computer science fields like bioinformatics, machine learning, and natural language processing, as interesting as those fields are to us.

The quiz card app itself is also very interesting, and uses React to render the interface.  Contributions and suggestions are very welcome.  I've got a definite goal in mind for the end app, so before making in large changes, please discuss it with me in an issue.

To contribute a question, simply [generate a UUID](https://www.uuidgenerator.net/) and add the needed fields to the `public/data/cards.json` file, and submit a PR. Every image needed by a card is named by that card's UUID + "img" + image index (e.g., "30c2457a-4295-43f2-b2dc-fc95a7001acc-img0.png" for first card's image for card). Also, this [interactive Latex editor](http://arachnoid.com/latex/) that can generate images is very useful until we've set up a more elegant system.

Right now, it's a crude system hosted on Github, but if it gains interest, I'll set up a database to keep user stats over time, and offer an easier way to contribute questions than writing raw JSON.

### Installation

If you are working on the React app, and want the livereload to work, must run `npm install` from /node_modules/gulp-livereload directory also after base installation (don't ask!).

### License

MIT

Copyright (c) 2014 Eric. S Bullington

