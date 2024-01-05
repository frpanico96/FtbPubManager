# FTB Pub Manager by FTB Studio

##### Table of Contents

- [A Pub Management application you have never seen before](#a-pub-management-application-you-have-never-seen-before)
  - [Home Page](#home-page)
  - [Pub List Page](#pub-list-page)
  - [Pub Home Page](#pub-home-page)
  - [Menu](#menu)
  - [Reservations](#reservations)
  - [Reservation Manager](#reservation-manager)
  - [Contact Info](#contact-info)
  - [Reviews](#reviews)
- [Open Source and features to come](#open-source-and-features-to-come)
- [Installation](#installation)
  - [iOS build](#ios-build)
  - [Android build](#android-build)
  - [Run Server](#run-server)

## A Pub Management application you have never seen before

```
current version: 0.1.0

DISCLAIMER
This application is born as an excercise to learn React Native and Mobile Development itself so it probably does not follow all thier best practice.
If you think that some part can be refactored or improved, feel free to open an issue or even a pull request if you want to contribute.

Thanks

```

The Pub Manager App is thought with the idea of having multiple people reaching the same app to manage (as owner
or customer) multiple Pubs which may or may not be related to each other.

<img src="./assets/ReadmeAssets/Cover.jpeg" width="250">

This app allows multiple feature such as:

- Check out the menu (or create the menu if you are the owner of the Pub)
- Reserve a table
- Check out Pub contact details
- Manage your reservations
- Leave a feedback to the pub you have just spent the night!

### Home Page

In the home page the user can choose between:

- Login as a customer
- Login as a guest

<img src="./assets/ReadmeAssets/HomePage.jpeg" width="120">
<img src="./assets/ReadmeAssets/SignPage.jpeg" width="120">

Logging as a guest allows you to simply check out which pubs are present in the app, their contacts and their menu.

As a logged in customer you have additional features such as:

- booking a table
- Writing a review

### Pub List Page

Once you have logged in, you will be presented a list of pubs

<img src="./assets/ReadmeAssets/PubListPage.jpeg" width="150">

The two icons on the top left corner represent the following feature:

- Showing all reservation for the user across all pubs

- <ins>(Available only for Owners)</ins> Filter for pubs owned.

### Pub Home Page

After selecting the Pub you will be presented the following View

<img src="./assets/ReadmeAssets/PubMainPage.png" width="150">

From here you can choose one of the action you are willing to do

### Menu

On the Menu page, the Menu will be show in an accordion fashion: pressing one of the voices of the menu it will expands showing all the items for that particular voice (e.g. Appetizers)

<img src="./assets/ReadmeAssets/MenuPage.jpeg" width="120">
<img src="./assets/ReadmeAssets/MenuEditPage.jpeg" width="120">

<ins>Owners</ins> can create a new Meun Item via a button that they have on the UI or edit an existing menu item by long pressing it.

### Reservations

On the reservation menu it is possible to create a Reservation filling the form.

<img src="./assets/ReadmeAssets/ReservationPage.jpeg" width="150">

The form takes in consideration:

- Closure Days
- Closure Time
- Vacations Days

<ins>Owners</ins> can make the reservation on their pubs as well, this is thought to handle reservations that comes from other channles besides the application such as phone calls.
The reservation will have no name on it (i.e. anonymous reservation)

### Reservation Manager

It is possible to see your reservations for that particular pub on the **Reservation Manager** page

<img src="./assets/ReadmeAssets/ReservationManagerPage.jpeg" width="120">
<img src="./assets/ReadmeAssets/ReservationManagerPageActions.jpeg" width="120">
<img src="./assets/ReadmeAssets/ReservationManagerPageCancel.jpeg" width="120">
<img src="./assets/ReadmeAssets/ReservationManagerPageEdit.jpeg" width="120">

By the swipeable gesture handle from left to right it is possible to perfor actions on the reservation:

- Cancel Reservation
- Edit Reservation
- <ins>(Owner only)</ins>Edit Status Reservation

Owners can modify the Status of the reservation, e.g. from "Booked" to "Shown" as soon as the user shows herself at the Pub.

All status available are:

- Booked
- Cancelled
- Not Shown
- Shown

Once the reservation changes its status from "Booked" to any other status, it's not possible to perform any other action.

Owners can also indicates if the user has been called back.

Status and callbacks contribute to increase/decrease the score of a particular user.

As of today, the score is not used in the application but in the future it may be used to warn the pub owner of a potential fake reservation.

### Contact Info

From the Contact Info page, users can see many information about the pub such as:

- address
- closing days
- contacts
- vacations

<img src="./assets/ReadmeAssets/ContactInfoPage.jpeg" width="150">

<ins>Owners</ins> have an additional button on the page to make modification about the information shown on the page.

<img src="./assets/ReadmeAssets/ContactInfoDetail.png" width="100">
<img src="./assets/ReadmeAssets/ContactInfoDetailContact.png" width="100">
<img src="./assets/ReadmeAssets/ContactInfoDetailAddress.png" width="100">
<img src="./assets/ReadmeAssets/ContactInfoDetailOpenCloseTime.png" width="100">
<img src="./assets/ReadmeAssets/ContactInfoDetailVacation.png" width="100">
<img src="./assets/ReadmeAssets/ContactInfoDetailOtherInfo.png" width="100">

It can also modify:

- Delay (in hours) from the momnet the user is making the reservation to the hour of the actual reservation (e.g. if a owner sets up a 3 hour delay and a user is booking at 4 p.m. the first available time to make the reservation will be 7 p.m.).
- Require phone number in reservations
- Show the owner username on the pub

### Reviews

Logged users can also give a feedback to the pub via the Review service.

<img src="./assets/ReadmeAssets/ReviewPage.jpeg" width="150">

You can give a score of what your experience was at the pub

<img src="./assets/ReadmeAssets/ReviewPageForm.png" width="120">
<img src="./assets/ReadmeAssets/ReviewPageFormDropdown.png" width="120">

Other users can like or dislike your review, while only pub owner and the user that created the review itself can comment the review (owner of the pub is marked with a tag under the name).

<img src="./assets/ReadmeAssets/ReviewPageDetail.jpeg" width="150">

Currently available in:

- English
- Italian

## Open Source and features to come

This project is meant to be open source so anyone can contribute to it by opening a pull request or otherwise an issue.

Let's discover new features for the app yet to come:

- Adding more customization for owners (pub logo on the pub button)
- Creating a workflow enabling users to submit a registration for their pubs
- Notifications

## Installation

To be able to run this app (assuming you are fully setup for ReactNative) there are few steps to pursue:

- Create a local .env file with keys
  - JWT_SECRET
  - DB_PATH
- Create a local "localconfig.json" with an Object containing the following key
  - SERVER_BASE_PATH

Run the command

```
$ npm install
```

It may throw a post-installation error you can ignore since it will not affect the build

### iOS build

To correctly build on iOS execute the following command

```
$ cd ios && pod install && cd .. && npm run ios
```

### Android build

**Do not use versions higher than JDK 17**

Before running Android check if the app build correctly

```
$ cd android && ./gradlew clean
```

It usually trhows the following error

```
A problem occurred evaluating project ':react-native-i18n'.
> Could not find method implement() for arguments [com.facebook.react:react-native:+] on object of type org.gradle.api.internal.artifacts.dsl.dependencies.DefaultDependencyHandler.
```

So before launching the clean command go to
./node_modules/react-native-i18n/android/build.gradle

and perform the following substitution

```
/* OLD */
dependencies {
  compile "com.facebook.react:react-native:+" // From node_modules
}

/* NEW */
dependencies {
  implementation "com.facebook.react:react-native:+" // From node_modules
}
```

After doing this, the ./gradlew clean command will terminate succesfully.

Than you can run android version of the app

```
$ cd .. && npm run android
```

### Run Server

To run the server (assuming you already have Docker) always in the project folder

```
$ docker-compose up
```

If the following command throws the error

```
mongo exited with code 14
```

cleanup the data folder and run "docker-compose up" again
