# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## 3.0.0

This is an almost complete overhaul for the library. Though the logic for tracking elements remains the same now you can create isolated observers. This means you can pass different configurations to them but also means you can `disconnect` them independently, something that was not possible before.

I suggest going through the README file inside this repository to learn about the new API.


## 2.0.0

### Fixed
- **in** function is now called **enter** to avoid issues with some compilers since it's a reserved words.

### Improved
- Listeners are added only when elements are being _hunted_, avoiding unnecessary operations on scroll.


## 1.0.2

### Fixed
- Bug in object calculation on Internet Explorer
- Throttle all events using setTimeout


## 1.0.1

### Added
- Build page tracking **120 elements** for testing purposes

### Fixed
- Bug present when element parent node had `position: relative` rule
- Fix one pixel deviation on element top limit
- Improve frame rate adding deboucing actions with requestAnimationFrame
