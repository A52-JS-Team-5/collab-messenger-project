# Chatter
### A collab messenger project: The place where seamless conversations meet sleek, responsive design and innovative features.

## Table of Contents

- [Project Overview and Goals](#Project-Overview-and-Goals)
- [Features](#Features)
- [Project Setup and Running Instructions](#Project-Setup-and-Running-Instructions)
- [Firebase Setup Instructions](#Firebase-Setup-Instructions)
- [Project Folder Structure](#Project-Folder-Structure)
- [Database Structure](#Database-Structure)
- [Project Screenshots](#Project-Screenshots)
- [Development Team](#Development-Team)


## Project Overview and Goals
**Project Name:** Chatter

**Project Link:** 

**Project Description:** Chatter is a messenger app, which enables you to:
  * socialize by creating one-on-one and group chats with any of our users
  * create and manage your own teams
  * start unlimited conversations in your teams by creating public/private channels
  * react to messages, share GIFs, emojis, images and files in the chats and channels
  * save any chat or channel message to view later
  * inform yourself about your teams and channels through notifications in Insights page

**Technologies Used:** 
 * React
 * JavaScript
 * Tailwind CSS & DaisyUI
 * Firebase Realtime Database, Authentication and Storage

**Project Goal:** Our goal is to provide an intuitive app that effortlessly meets the needs of both personal and business conversations, complemented by a modern and responsive design as well as excellent user experience.

## Features

**Public (for all users):**

  * Register or Login to gain access to private features

  * View Home page with information about the app
  
  * View About and FAQ pages with more information about using the app and its creators

**Private (for registered users):**

  1. **Insights Page**
  * View, mark as (un)read and delete your notifications about any teams and channels you participate in
    
  * View your Engamement Summary: number of chats, teams, channels you participate in and the number of your saved items
    
  * Gain quick access to your teams and chats, FAQ and About pages.

  2. **Chats Page**
  * View all chats you participate in
  * Start new one-on-one or group chats
  * Receive indication for unread messages in any chat
  * React to messages
  * Send GIFs, files and emojis
  * Save any message in your Saved Items
  * View information about the chat, including its participants and shared files
  * For group chats: add more members, leave or edit the chat title

  3. **Teams Page**
  * View all teams you participate in
  * Create new teams 
  * Team creators can manage and delete the team they've created
  * View team channels you participate in
  * Receive indication for unread messages in teams' channels

  4. **Channels**
  * Channels are accessed in the team view
  * Channels can be public or private (public channels include all team members)
  * Team creators can add, edit and delete team channels
  * React to messages
  * Send GIFs, files and emojis
  * Save any message in your Saved Items
  * View information about the channel, including its participants and shared files

  5. **Later Page**
  * View or remove messages you've saved

  6. **Other Features**
  * change your status to Online, Offline or Away
  * search, sort and explore profiles of other users 
  * edit and personalize your profile by including a bio and a profile photo
  * switch between light and dark mode

## Project Setup and Running Instructions

These instructions are aimed at all developers who have been added to the project team and at anyone who simply wishes to view the project code:

  * Clone the repository from GitHub
  * Open the `collab-messenger` folder
  * Run `npm install` to install any dependencies, described in the `package.json` file
  * Setup a Firebase Web Project by following the instructions below. Add your firebaseConfig data in `src/config/firebase-config` file
  * Run `npm run dev` to open the app in your browser

## Firebase Setup Instructions

This project requires:
 * Firebase Realtime Database to organize and store data
 * Firebase Authentication to authenticate users
 * Firebase Storage to store files and media uploaded on the app

Instructions for Firebase setup are as follows:
 * Create a Firebase account in https://firebase.google.com/ 
 * Add a new web project
 * Add Authentication with email/password login
 * Add Storage
 * Add Realtime Database with the following Rules:

        {
          "rules": {
            ".read": "now < 1703023200000",  // 2023-12-27
            ".write": "now < 1703023200000",  // 2023-12-27
            "users": {
                ".indexOn": "uid",
            },
            "chats": {
                ".indexOn": ["uid", "participants"],
            },
            "messages": {
                ".indexOn": ["uid", "chatId", "channelId"],
            },
            "teams": {
                ".indexOn": ["id", "name", "members"],
            },
            "channels": {
                ".indexOn": ["id"],
            }
          }
        }

## Project Folder Structure

The source code is separated in folders and single-responsible components, as follows:
  * `assets` - holds resources displayed on or used in the app, such as images, logos, etc.
  * `common` - holds commonly used constants and helper functions
  * `components` - holds the reusable React components that make up the app
  * `config` - holds the file needed for configuration of Firebase
  * `context` - holds the context shared between components, specifically the logged user's data
  * `hoc` - holds Authenticated Route component for restricted access of not logged in users to private app pages
  * `services` - holds all functions needed for reading, writing or removing data from database or other needed procedures
  * `views` - holds the templates for the look of the different app pages

## Database Structure

Project data is stored in Firebase Realtime Database in the following documents:
  * `channels` - stores any data connected to created channels in the app. 
  
  Example:

     "categories": {
      "Arts-Crafts": {
        "description": "Various creative DIY projects, including painting, knitting, and crafting, and exchange ideas with fellow crafters.
        ",
        "id": 0,
        "name": "Arts & Crafts"
      },
    },

  * `chats` - stores any data connected to created chats in the app. 

  Example:

    "comments": {
      "-NjBuT14PizudIKWzVYy": {
        "author": "georgidobrev",
        "createdOn": 1699949961473,
        "description": "Hello again, I forgot to mention that I currently own 1 dumbbell with a total weight of 10 kgs. Thank you in advance!",
        "postId": "-NjBu8a_OuGkdFJb7Jd7"
      },
      "-NjBuXt55hsWfCTaZhsT": {
        "author": "yovchev",
        "createdOn": 1699949981091,
      "description": "Hi, George, what's your question?",
        "postId": "-NjBu8a_OuGkdFJb7Jd7"
      }
    },

  * `messages` - stores all sent messages in the app with their detailed information, such as:
    
    author (user that uploaded the post),
    
    category in which the post was made,
    
    title, description and date of creation,
    
        "posts": {
          "-NjBu8a_OuGkdFJb7Jd7": {
            "author": "georgidobrev",
            "category": "Fitness",
            "commentedBy": {
              "georgidobrev": true,
              "stoykova": true,
              "yovchev": true
            },
            "comments": {
              "-NjBuT14PizudIKWzVYy": true,
              "-NjBuXt55hsWfCTaZhsT": true,
             "-NjBvWkFwt-idXyiidtH": true,
              "-NjBy5DAT1Zn0OHlBeIK": true
            },
            "createdOn": 1699949877792,
            "description": "Hello, I'm Georgi and I would like to introduce myself and ask for your help regarding some dumbbell exercises.",
            "likedBy": {
              "georgidobrev": true,
              "stoykova": true,
              "yovchev": true
             },
            "title": "Dumbbell exercises question"
            }
        },
  
  * `notifications` - stores all notifications about teams and channels.

  * `teams` - stores all data about teams created in the app
    
  * `users` - stores data regarding registered users, such as:
    
    handle (username, chosen by the user),

    name, surname and phone number,
    their status and avatar image URL
    
    email and date of creation of profile,

    channels, chat and teams that user is a member of 

    saved messages, 
    
         "users": {
            "emma": {
              "createdOn": 1699957309906,
              "email": "emmast@abv.bg",
              "handle": "emma",
              "isAdmin": false,
              "isBlocked": false,
              "name": "Emma",
            "surname": "Stone",
              "uid": "Kh7ZUV75UDdk5S23G1IwqxEM30A3"
            },
            "georgidobrev": {
              "bio": "Hello, I'm Georgi and this is my bio.",
              "commentedPost": {
                "-NjBu8a_OuGkdFJb7Jd7": true,
                "-NjBuL-CBeIolrJ3LDdv": true,
                "-NjBvNryVoaxBz7qW4WU": true
              },
              "createdOn": 1699949599775,
              "email": "georgidobrev.5@gmail.com",
              "handle": "georgidobrev",
              "isAdmin": true,
              "isBlocked": false,
              "likedPosts": {
                "-NjBu8a_OuGkdFJb7Jd7": true,
                "-NjBuL-CBeIolrJ3LDdv": true,
                "-NjBvNryVoaxBz7qW4WU": true,
                "-NjByquV0qhljcTYhdxa": true
              },
              "name": "Georgi",
              "surname": "Dobrev",
              "uid": "QLfNKADTZjXZxgEjXCa7SSyPXx32"
            }
          }

## Project Screenshots

## Development Team
**Telerik Academy A52 Team 5**:
 * Georgi Dobrev, GitHub: https://github.com/georgidobrev
 * Teodora Gigova, GitHub: https://github.com/teodoragigova
 * Silvia Stoykova, GitHub: https://github.com/silviastoykova