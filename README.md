# To-Do-List

# How to use this repo?
To access this repo, the source files are webToDo.html and webToDo.js, both of which I have made myself. The reference I took was from the files referenceToDo.html and referenceToDo.js.

# Problems I faced and the explanations to their solutions

**Problem : Why del.parentElement doesn't work and why this.parentElement works? I also don't understand the difference in impacts on using arrow functions or normal functions. (Lines 27 to 34 in webToDo.js)**

**Solution:**
Start with this idea: your code has *two* separate concepts:

- What variable you are using (`del` vs `this`)
- What kind of function you are using (arrow function vs normal function)

Both matter for what `parentElement` ends up being.


**Step 1: What your original code does**

Assume this to be our code between lines 27 to 34 for this problem:

```*js*
let dels = document.querySelectorAll('.del');

for (del of dels) {
  del.addEventListener('click', () => {
    let parent = del.parentElement;
    console.log(parent);
  })
}```

Read it in words:

- “Find all elements with class `del` (all three buttons).”
- “For each button, add a click listener.”
- “When clicked, log `del.parentElement`.”

Important detail: you wrote `for (del of dels)` *without* `let` or `const` in front of `del`.

That means:

- `del` becomes one single variable in the outer/global scope.
- In the loop, you keep reassigning that *same* `del`:
  - First iteration: `del = first button`
  - Second iteration: `del = second button`
  - Third iteration: `del = third button`

When the loop is finished, `del` points to the *last* button only.


**Step 2: Closures – why every click “sees” the last `del`**

The function you pass to `addEventListener`:

*js*
() => {
  let parent = del.parentElement;
  console.log(parent);
}

This function does *not* run during the loop.  
It runs later, when you click.

But the function “remembers” variables from the outside – that is called a closure.  
The key point: it remembers the *variable*, not its old value.

The callback doesn't run during the loop- no, it runs when the event listener is triggered. Therefore, the loop runs like this:
- The `del` variable is assigned to the first delete button and a click event listener is added to it. Note that the callback function doesn't execute yet.
- The same `del` variable is now assigned to the second delete button and another listener is added to it as well.
- The same is repeated for all the buttons until `dels` exhausts.
- Now, since `del` was declared without `let`, it is declared out of the scope of the loop, therefore, the same variable is updated in every iteration. This is why `del` points to the last delete button right now.
- Now, this is when a user might click on a delete button- any one- which will trigger it's event listener and the callback of that button will now be executed. However, since we have written `del.parentElement` in the callback, the li of the last delete button will be displayed because `del` points to the last delete button.

So:

- There is only one variable named `del`.
- After the loop, `del` is the last button.
- When you click any button, the function runs and looks at `del`.
- At that moment, `del` is the last button, so `del.parentElement` is the last `<li>`.

So: `del.parentElement` “doesn’t work” because it always looks at the one shared `del` variable, and that variable now refers to the last button.


**Step 3: Why `this.parentElement` works (with a normal function)**

Change the listener to a normal function:

*js*
for (let del of dels) {
  del.addEventListener('click', function () {
    const parent = this.parentElement;
    console.log(parent);
  });
}

Two important changes:

1. You now have `for (let del of dels)`  
   - This creates a *new* `del` variable for each iteration.
   - That alone already fixes the “always last” problem: each handler closes over its own `del`.

2. You use a *normal function* instead of an arrow function.  
   In a normal function called as an event listener, `this` is automatically set to the element that the event listener is attached to (the button you clicked).

So inside `function () { ... }`:

- `this` is “the button that was clicked”.
- `this.parentElement` is “the `<li>` containing that button”.

This does *not* rely on the outer `del` variable at all.  
That is why `this.parentElement` always gives you the correct `<li>`, even if you made a mistake with `del`.


**Step 4: Arrow function vs normal function for `this`**

The big difference:

- In a **normal function** used as an event listener:
  - `this` is the DOM element that received the event (the button you clicked).
- In an **arrow function**:
  - `this` is *not* set by the event system.
  - Instead, it is “inherited” from the outer scope.
  - So `this` usually is `window` or some other outer value, not the button- undefined, in this case.

So this:

*js*
del.addEventListener('click', function () {
  console.log(this); // the button that was clicked
});

vs this:

*js*
del.addEventListener('click', () => {
  console.log(this); // NOT the button; likely window/undefined depending on strict mode
});

Because of that, when you use an arrow function, `this.parentElement` is not what you expect.

So:

- `this.parentElement` only “works” if you use a *normal function* as the event handler.
- With an arrow function, you should use `event.target.parentElement` instead of `this.parentElement`.


**Step 5: Clean, modern way to write it**

The simplest, least confusing version:

*js*
const dels = document.querySelectorAll('.del');

for (const del of dels) {
  del.addEventListener('click', (event) => {
    const parent = event.target.parentElement;
    console.log(parent);
  });
}

Why this works:

- `const del` in the loop: each iteration gets its own `del`. Why not `let del`? `let` variables can be reassigned but `const` variables can't be reassigned. `dels` is the list of buttons. Inside the loop, `del` is“the current button for this iteration”. You never do `del` = somethingElse inside the loop, so, there is no need to reassign `del`. Using const communicates: “`del` in this iteration will not change.” If you changed `const del` to `let del` in that loop, the behavior of your code would be the same; it would just allow reassignment that you do not need.
- Arrow function: do not rely on `this` at all.
- Use `event.target`: that is always the element that was actually clicked.
- `event.target.parentElement` is the `<li>` for that button.


**Step 6: Summary in plain words**

- `del.parentElement` failed because all handlers shared one `del` variable, and after the loop that variable pointed to the last button.
- `this.parentElement` works (with a normal function) because `this` is automatically set to the button that was clicked i.e. the element on which the event listener was added, so it always points to the correct `<li>`.
- Normal function vs arrow function:
  - Normal function: `this` = the element that has the listener (the clicked button).
  - Arrow function: `this` = whatever it was outside the function, not the clicked element, so don’t use `this` here; use `event.target` instead.