import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsProvider } from './src/context/SettingsContext';

import Login from './src/screens/LoginScreen';
import Signup from './src/screens/SignupScreen';
import ForgotPassword from './src/screens/ForgotPassword';
import Dashboard from './src/screens/Dashboard';
import AddPlan from './src/screens/AddPlan';
import RegisterMember from './src/screens/RegisterMember';
import ExpiryScreen from './src/screens/ExpiryScreen';
import MembersScreen from './src/screens/MemberListScreen';
import MemberDetails from './src/screens/MemberDetails';
import RenewMembership from './src/screens/RenewMembership';
import Paymenthistory from './src/screens/Paymenthistory';
import Renewalhistory from './src/screens/Renewalhistory';
import TransactionsScreen from './src/screens/TransactionsScreen';
import ReceiptScreen from './src/screens/ReceiptScreen';
import Settings from './src/screens/Settings';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <SettingsProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={isLoggedIn ? 'Dashboard' : 'Login'}
          >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="AddPlan" component={AddPlan} />
            <Stack.Screen name="RegisterMember" component={RegisterMember} />
            <Stack.Screen name="ExpiryScreen" component={ExpiryScreen} />
            <Stack.Screen name="MemberListScreen" component={MembersScreen} />
            <Stack.Screen name="MemberDetails" component={MemberDetails} />
            <Stack.Screen name="RenewMembership" component={RenewMembership} />
            <Stack.Screen name="Paymenthistory" component={Paymenthistory} />
            <Stack.Screen name="Renewalhistory" component={Renewalhistory} />
            <Stack.Screen
              name="TransactionsScreen"
              component={TransactionsScreen}
            />
            <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} />
            <Stack.Screen name="Settings" component={Settings} />
          </Stack.Navigator>
          
        </NavigationContainer>
      </PaperProvider>
    </SettingsProvider>
  );
}
