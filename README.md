# coach stephan

## overview
We built a mobile app connected to a backend and database, designed to integrate seamlessly with
wearable data. The app connects to an ElevenLabs conversational agent that serves as a personal
running coach with two key features:

1. On-run guidance : providing real-time voice feedback to accelerate or slow down based on pace
and heart rate, ensuring optimal performance and reduced injury risk. In order to let the runner
focus on their environment, while performing this task the conversational agent gives brief
answers.

2.  Off-run insights : analyzing data from runs, sleep patterns, and nutrition habits to deliver
personalized tips and progress updates. For this task the conversational agent is talkative and
delves into details.




## demo

<p align="center">
  <img src="./demo.gif" width="70%" alt="App demo" />
</p>


## stack

> **db** : sqlite
> **backend** : python + fastAPI
> **frontend** : expo + react native + tailwind
> **api** : ElevenLab conversationnal agent

## challenges

> We were not familiar with Expo and React Native, so the configuration was complex and we faced a tremendous number of bugs. Additionally, integrating ElevenLabs into Expo was not straightforward for new Expo users.



> These Expo-related difficulties snowballed, preventing us from implementing all our planned features. The UI had to be built manually, which took significantly more time than expected.



## getting started

- Download the apk (or build with expo (good luck))


- lauch the server : pip install -r requirement | uvicorn main:app --host 0.0.0.0 --port 8000