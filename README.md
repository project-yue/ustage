#NodeJS UpStage Proof of concept

#### Rationale

In the current UpStage implementation, the ActionScript (AS) code on the client side requires Flashplugin. The AS code provide all the functionalities for UpStage users. The main features include: real time chatting, drawing, moving avatar etc.
The idea is to replace the above functionalities from the current AS work into some other technologies with better compatibility. I then found HTML tags for holding the performing elements, Bootstrap for rendering stages, JQuery to handle events from clients, and NodeJS as a substitute for Twisted framework. I prefer NodeJS over Twisted as I can develop the whole software under my scope, and test my work instantly without any hassle in application build process.


#### Travis CI Build Status

[![Build Status](https://travis-ci.org/yue-l/ustage.svg?branch=master)](https://travis-ci.org/yue-l/ustage)

####License Declaration

This project was developed for meeting the redesign requirements of UpStage. This trial is developed in HTML5 stack with NodeJS as server.

Copyright (C) 2014-2015  Yue Li


This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.


##How to use this project:
You must have installed NodeJS onto your computer.

In terminal, cd to the project root folder. Execute "npm install". Once the module installation completed, enter "npm start" to start the server. The final step is to open a browser, and type in "localhost:30000". It should bring up this Node application.

##Random Thoughts
As redesigning UpStage involves quite strong analysis skills to capture the possible closest approach for the new requirements. I initially considered to build a prototype based on an engine. Then I found the engine option seems not serving the application in portable devices support. 

I think a mature platform will increasingly shorten the development processes.
