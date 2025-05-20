import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function HomeTabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name='submissions'
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='leaf-outline'
              size={size}
              color={color}
            />
          ),
          tabBarLabel: 'Submissions',
          title: 'Plant Submissions',
        }}
      />
      <Tabs.Screen
        name='plants'
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='information-circle-outline'
              size={size}
              color={color}
            />
          ),
          tabBarLabel: 'Information',
          title: 'Plants Information',
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name='person-circle-outline'
              size={size}
              color={color}
            />
          ),
          tabBarLabel: 'Profile',
          title: 'My Profile',
        }}
      />
    </Tabs>
  );
}
