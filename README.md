# 4stream-frontend

## Overview
Donation alerts for video streamers (frontend)

**4stream** - service for video game streams that provides live donation alerts using payment systems popular in Russia.

![image](/image.png)

The service was lauched in early 2016, and discontinued in the end of the same year. It was available at https://4stream.ru,
the domain currently serves unknown content. 

Other resources related to the discontinued service:
* [Youtube channel](https://www.youtube.com/channel/UCgLNggYXyuPlchgVLtkb5Aw)
* [Twitter](https://twitter.com/_4stream)
* [VK group](https://vk.com/4streamgroup)

## Technologies
The service frontend was written using modern technologies at that time. It includes:
* `React 15`
* `Alt` (flux methodology library, somewhat similar to currently well-known redux)
* `SASS`, in particular `BEM` technique for well-structured CSS

Landing page as well as most other public pages was implemented using Unify html template that requires many other things
as dependencies such as `jquery`. The template helped to create fancy looking and SEO-friendly pages, while the dashboard
was implemented using libraries from the above mentioned list, and most widgets were written from scratch.

## Building
`npm install` and `npm run start` to launch in development mode.

Note: the frontend is not fully functional without the backend that source code is not published at the moment of writing.
