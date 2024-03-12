import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef} from './rootNavigation';

import Login from '../pages/Login';
import Type from '../pages/Steps/type';
import Payment from '../pages/Steps/payment';
import Car from '../pages/Steps/car';
import Home from '../pages/Home';
import Ride from '../pages/Ride';

const Stack = createStackNavigator();

const Routes = () => (
  <NavigationContainer ref={navigationRef}>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        options={{headerShown: false}}
        name="Login"
        component={Login}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Type"
        component={Type}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Payment"
        component={Payment}
      />
      <Stack.Screen options={{headerShown: false}} name="Car" component={Car} />
      <Stack.Screen
        options={{headerShown: false}}
        name="Home"
        component={Home}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Ride"
        component={Ride}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Routes;
