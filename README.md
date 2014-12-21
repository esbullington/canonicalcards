# Flashcards

### What is this?

#### tldr
An open source flashcard program to review canonical computer science algorithms, data structures, architectures, and techniques. It is *not* intended to teach these concepts, but rather to review them and (eventually) provide some sort of benchmark over time of the user's progress.

#### The long version
A recent [HN thread](https://news.ycombinator.com/item?id=8775375) discussed the fact that many programmers who come to the profession lack the shared vocabulary that programmers had in the past.

The reasons for this change are vast, but probably boil down to two issues:

1. The field is much larger, and continually expanding
2. Many programmers are career changers, and lack the formal computer science education most programmers used to have.

I count myself as one of those who have entered the programming from a (mostly) unrelated field.  I completed graduate training in public health but then went on to work as a medical translator for over a decade.  A few years ago, I decided to turn my hobby-level interest in programming into something more serious, and so I set out to become a professional programmer.

To my dismay, I found that most programmer interviews were pretty hard for me.  I've always been an excellent interviewer, so this was quite a blow.  At first, I thought that interviewers were asking "puzzle" questions out of left field.  But eventually, as I've learned more about the foundations of computer science, I'm come to realize that many -- if not most -- of these problems had some basis in the canonical computer science education, which I had missed.

Great! So now I just had to study that material on my own.  Well, this has gone well, and I've learned a lot of interesting things, but I've run into two major difficulties:

1.  A lack of a benchmark with which to gauge my progress.
2.  A very human tendancy to forget the material I had learned over time.

This project is designed to remedy these two problems, not only for myself, but for the many thousands of programmers who have come to the field via non-traditional routes.  And older programmers who wish to review the state of their knowledge would benefit as well.

So now all that remains to be done is build the app (partially done) and assemble the cards (a huge task!).

### What this is *not*
This is *not* intended to teach these CS concepts.  For that, you'll need study on your own.  Coursera and EdX have some excellent CS courses and increasing number of high-quality textbooks are open source.  The goal is to include a brief explanation beside each answer, along with a set of links for in-depth self-study.

The flashcards are in the form of multiple choice, although I'm also working on a spaced repetition version.  I'll also probably expand the quiz to use self-reported answer results, so users don't have to see multiple choices if they don't want to when they answer.

### How you can help

First and foremost, I need help building up a set of flashcards that cover the core classes of a traditional computer science education.  For the sake of this project, we'll probably not go deep into upper-level or graduate-level classes, but rather the very foundation courses that most CS students take in their first and second years:

* Algorithms
* Data structures
* Theory of computer
* Programming languages
* Formal methods 

Because we have to draw the line somewhere, we're not particularly interested in applied computer science fields like bioinformatics, machine learning, and natural language processing, as interesting as those fields are to us.

### Installation

Must run `npm install` from /node_modules/gulp-livereload directory also after base installation (don't ask!).

