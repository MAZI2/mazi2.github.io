# Graphing website

## Documentation 
### New points
Add or remove point and set __x__, __y__ and __name__.  
Add point by clicking on __expression graph__  
__Bind expression__ to point by hovering over point name.

### New expression
Add or remove expression and set __y value__ (_"y = ..." / y=..._) (Example: _y = (3 * x) + 2_ )  
Also supports javascript ```Math.``` so to use them in expression use Math. (Example: _y = 3 * **Math.cos**(x + 5)_ )  
Set __color__ of expression  
__Show/hide__ expression with click on expression name.

### Configure axis
Set x and y-axis __name__ and change their __scale__ with _click and drag_ or by _scrolling_.  
Configure step by changing __Step x and y__ or choosing a step on axis and changing its value.

### Features
Connect points.  
Autoscale the axis.  
Show point name and exact x, y-axis value on mouse-over or toggle with click on the point. 

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
