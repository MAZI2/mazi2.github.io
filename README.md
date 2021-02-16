# Graphing website

## To do
- Translating X and Y position set by user to X and Y usable by SVG elements works by counting between which two steps on axis the point lies. This, as well as ordering points by X value, should be replaced using array.sort(); and counting the index, that the point was given in array.  
- Expressions don't scale when changing step

## Documentation 
### New points
__Add__ or __remove__ point and set __x__, __y__ and __name__.  
__Add__ point by __clicking__ on __expression graph__  
__Bind expression__ to point by hovering over point name.

### New expression
Add or remove expression and set __y value__ (_"y = ..." / y=..._) (Example: _y = (3 * x) + 2_ )  
Also supports javascript ```Math.``` so to use them in expression use Math. (Example: _y = 3 * **Math.** cos(x + 5)_ )  
Set __color__ of expression  
__Show/hide__ expression with click on expression name.

### Configure axis
Set x and y-axis __name__ and change their __scale__ with _click and drag_ or by _scrolling_.  
Configure step by choosing a __step on axis__ and changing value in Step box. If step is not selected, both axis will change step.

### Features
__ConLayer4nect__ points.  
__Autoscale__ the axis.  
Show point __name and exact x, y-axis value__ on mouse-over or toggle with click on the point. 

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
