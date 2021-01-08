# Graphing website

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Documentation 
### New points
Add or remove point and set __x__, __y__ and __name__.

### New expression
Add or remove expression and set __y value__ (_"y = ..." / y=..._) _(Example: y = (3 * x) + 2)_  
Also supports javascript ```js Math.```so to use them in expression use Math. _(Example: y = 3 * **Math.cos**(x + 5))_

### Configure axis
Set x and y-axis __name__ and change their __scale__ with click and drag.

### Features
Connect points.  
Autoscale the axis.  
Show point name and exact x, y-axis value on mouse-over or toggle with click on the point. 
