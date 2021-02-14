# Andrej's suggestions

I was going to make these changes in the actual code, but there were some bugs on master and it made it hard for me to know whether any of my changes caused them, so I'll just outline some things that I noticed and you can change the things you feel need changing or just know these things for your next project. Overall I think you did a great job with the app :)

## "v-bind:key" vs ":key"

I see that you use `v-bind:key` on `v-for`, you can use just `:key` as `:` is actually just shorthand for `v-bind:`. Anywhere you see `v-bind:__whatever__` you can use `:__whatever__` instead.

## Using ids instead of $refs

With vanilla JS we use `id` to target elements, but with vue this is usually done with the `ref` prop and component's `this.$refs` property. The official documentation on this subject is lacking, but basically, if you put a `ref` attribute on an element or component (the sttribute value is just an identifier string just like `id`), you can acces that element in the `this.$refs` object. So instead of doing `document.getElementById("input")` you can do `this.$refs.input`. If you put a ref on a component you will get the entire component instance in the ref. So in our earlier example, if "input" was a vue component, `this.$refs.input` would basically return the `this` of the "input" vue component, this enables you to access any data, computed variables or methods of that component. To get the actual HTML DOM element from a component, you can do `this.$el`, or in the case of the "input" component `this.$refs.input.$el` to get the DOM element.

You can read a better explanation here: https://blog.logrocket.com/vue-refs-accessing-dom-elements/

Using `document.getElementById` works but it's more code to write, and it's not "the Vue way". It usually just makes code a bit more readable and in the case of component refs offers you far more functionality.

## Using keyCode in the keydown event listeners

The keycode event property is deprecated and should not be used anymore as some browsers may not support it. You can read more about it here: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode

What you should probabbly be using is the "key" property described here: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key

## Using jquery

Altho there is nothing necessarily wrong with using Jquery, in real world production aplications page load times are very important, so using both Vue and Jquery creates a very big app size which takes longer to download and load. Unless you need to use a specific package that requires jquery, there should be no need to bundle it with your application as everything jquery does can be done in another way with Vue and Vanilla javascript ($ selector can be replaced by refs, transitions and animation can be done with vue transitions and css (or if you really need to smaller and specialized animation libraties), html element properties can be accesed directly from the element's properties so `.offset()`/`.height()` arent really needed, ect.)

You should try to avoid using jquery and if there's something that jquery does well that you don't know how to do, there's probably someone on stackoverflow that answered how to do it with vue so you should check that out.

## ES6 Object function syntax

When writing vue methods instead of writing `myFunction: function(e) { // your code }`, you can do `myFunction(e) { // your code }`. This is just a modern javascript shorthand. You can read more about this here https://www.w3schools.com/js/js_es6.asp and in the sidebar at the bottom you will find other changes from 2009-2018. There were some really sweet new tools introduced so you should really take a look. (Important: Some of these features don't work on older browsers unless you compile code into older javascript, but vue apps do this by default during the build process (see Babel if you want to know more), so you don't have to worry about it for this project).

## Using timeouts

Timeouts are sometimes not the best idea for several reasons which I won't get into because there are many context specific cases and I'm not entirely sure why you used them in autoscale and I think it's a bit buggy so I won't dive deep into understanging how it works as I've done these recently and I know how much time it can take to make it work perfectly :D It may be a legitimate use, but I can smell some code smell and my spidey sense tells me that what you're trying to achieve can be done in a more reliable and performat way, but I'm not 100%. If you know what your issue was you can write me and we can figure out an alternative if there is one (and there probably is.) You might benefit from checking out the difference between `created()`/`mounted()` hooks and `$nextTick` vue function.

## Generating graph lines using components and maybe render functions

This is a shot in the dark and may not be useful here but I think it would. Instead of writing `createElement` and many `append attributes`, it would probably be easier to create a line component, importing it and appending it to the DOM (see example: https://stackoverflow.com/questions/55764553/vue-append-component-to-element). This may not be useful, but just so you know it exists, vue offers render functions for creating components which may or may not come in handy: https://vuejs.org/v2/guide/render-function.html

## Don't use eval() with user input

eval() is just a potential security risk, it can be done safely but can also be very unpredictable so avoid if at all possible.

## Final thoughts

Overall the app looks interesting and there's some great code in there and the project complexity shows a good understanding of fundementals of programming. There are obviously some things that could be done better but you get better at noticing those with experience and even then time constraints and life limits us from writing perfect code so there's always room for improvement :). One thing that I would also work on is splitting the app into smaller components, as they are easier to maintain and debug as you can test and understand smaller parts of the app's functionality in isolation without the need to understand the bigger picture. That being said, I can definitely see progress from the last app with your functions which are split into smaller easier to understand and better documented pieces. There is a limit to how small you should make functions and components before it becomes more annoying than helpful and while the components I found too big I think you found a relatively good balance for function size and functionality. Keep up the good work ;)