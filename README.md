# Chatter
### A collab messenger project: The place where seamless conversations meet sleek, responsive design and innovative features.

## Table of Contents

- [Project Overview and Goals](#Project-Overview-and-Goals)
- [Features](#Features)
- [Project Setup and Running Instructions](#Project-Setup-and-Running-Instructions)
- [Firebase Setup Instructions](#Firebase-Setup-Instructions)
- [Project Folder Structure](#Project-Folder-Structure)
- [Database Structure](#Database-Structure)
- [Project Images](#Project-Images)
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
  * `channels` - stores any data connected to created channels in the app. Example:

        "channels": {
          "-Nl2kk1P0pKJLhHwnjBt": {
            "createdOn": 1701943902266,
            "isPublic": true,
            "lastMessage": "Yes, I am.",
            "messages": {
              "-Nl7byXyOMne2FiFzQNG": true,
              "-Nl7hGG-1qQV7e_nopQd": true
            },
            "participants": {
              "georgi": true,
              "ivan": true
            },
            "participantsReadMsg": {
              "georgi": "Yes, I am.",
              "ivan": "Are you done with your task?"
            },
            "team": "NlT2JQlvQo_JbeEdos3",
            "title": "General",
            "uploadedFiles": {
              "url": "https://firebasestorage.googleapis.com/v0/b/testing-5cdb8.appspot.com/o/channel_uploads%2F-Nl2kk1P0pKJLhHwnjBt%2F"
            }
          }
        }

  * `chats` - stores any data connected to created chats in the app. Example: 

        "chats": {
          "-NlTRO2QT55tpvph8SkZ": {
            "createdOn": 1702391550426,
            "isGroup": false,
            "lastMessage": "How are you?",
            "messages": {
              "-NlTROX5kMNvgbZgn3G_": true,
              "-NlTRSuji4TCfwXdFBN2": true
            },
            "participants": {
              "stoyan": true,
              "alex": true
            },
            "participantsReadMsg": {
              "stoyan": "Hey",
              "alex": "How are you?"
            },
            "uploadedFiles": {
              "url": "https://firebasestorage.googleapis.com/v0/b/testing-5cdb8.appspot.com/o/chat_uploads%2F-Nl2kk1P0pKJLhHwnjBt"
            }
          }
        }

  * `messages` - stores all sent messages in the app with their detailed information. Example:
    
        "messages": {
          "-NlXlqsqwNWpWlRhygxx": {
            "author": "ivan",
            "chatId": "-NlTRO2QT55tpvph8SkZ",
            "content": "How are you?",
            "createdOn": 1702464284634,
            "reactions": {
              "georgi": "🩷"
            }
          },

          "-NlS_LgRqCO9NYZDnEUz": {
            "author": "silvia",
            "chatId": "-NlSZ6WcH6bJZHz5YsKu",
            "content": "https://firebasestorage.googleapis.com/v0/b/testing-5cdb8.appspot.com/o/chat_uploads%2F-NlSZ6WcH6bJZHz5YsKu",
            "createdOn": 1702377123182,
            "title": "Test Results.pdf",
            "type": "application/pdf"
          }
        }

  
  * `notifications` - stores all notifications about teams and channels. Example:

        "notifications": {
          "-Nl2O4zsmXj3LlmUiv3f": {
            "elemId": "-Nl2O4AZymYRMaf_H3fW",
            "message": "You have been added to a new team: Chatter Company Staff.",
            "timestamp": 1701937700788,
            "type": "addedToTeam"
          }
        }

  * `teams` - stores all data about teams created in the app. Example:
    
        "teams": {
          "-NlT2JQlvQo_JbeEdos3": {
            "channels": {
              "-NlT2K1J1c4etI2NQe7R": true,
              "-NlTBIpUPDwefhdgQUYA": true
            },
            "createdOn": 1702384978050,
            "description": "This team includes all staff members of Chatter",
            "members": {
              "georgi": true,
              "ivan": true
            },
            "name": "Chatter Company Staff",
            "owner": "georgi",
            "photoURL": "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"
          }
        }

  * `users` - stores data regarding registered users. Example:
    
         "users": {
            "georgi": {
              "channels": {
                "-Nl2O519TA52nDKdhvmK": true
              },
              "chatParticipants": {
                "ivan": "-Nl2Ol-jn8vAbnsHYa06"
              },
              "chats": {
                "-Nl2Ol-jn8vAbnsHYa06": true
              },
              "createdOn": 1701937683761,
              "email": "georgi@gmail.com",
              "handle": "georgi",
              "messagedChannels": {
                "-Nl2OJYKKDBEHAOymiwQ": true
              },
              "messagedPosts": {
                "-NlNptYATmK2IApKIdEk": true
              },
              "name": "Georgi",
              "notifications": {
                "-Nl2O4zsmXj3LlmUiv3f": true
              },
              "phoneNumber": "0890890890",
              "photoURL": "upload.wikimedia.org/Default_pfp.svg",
              "savedMessages": {
                "-Nl2_30_BWIXF-3a_Nl2": true
              },
              "status": "Online",
              "surname": " Georgiev",
              "teamsMember": {
                "-Nl2O4AZymYRMaf_H3fW": true
              },
              "teamsOwner": {
                "-Nl2O4AZymYRMaf_H3fW": true
              },
              "uid": "fHyNNYax4cPd6XyLb90D6sdh40v2"
            },
          }

## Project Images

![Chatter Mockup All Devices](/collab-messenger/public/mockups/chatter-mockup-devices.png)

![Chatter Mockup Computer Screen](/collab-messenger/public/mockups/chatter-mockup-screens.png)

![Chatter Mockup Mobile Screen](/collab-messenger/public/mockups/chatter-mockup-mobile.png)

## Development Team
**Telerik Academy A52 Team 5**:
 * Georgi Dobrev, GitHub: https://github.com/georgidobrev
 * Teodora Gigova, GitHub: https://github.com/teodoragigova
 * Silvia Stoykova, GitHub: https://github.com/silviastoykova