/**
 * EasyShop - Layout de Navegação em Abas (Expo Router)
 * 
 * Configuração das duas abas principais exigidas pelo desafio:
 * 1. Clientes (SQL Local - SQLite)
 * 2. Produtos (NoSQL Local - Document Store)
 * + Aba adicional informativa sobre a Arquitetura em 3 Camadas e Persistência Poliglota.
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 17,
          color: '#0f172a',
        },
        tabBarActiveTintColor: '#1e40af',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          height: 60 + (insets.bottom > 0 ? insets.bottom : 8),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      {/* Aba 1: Clientes (SQL Local) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Clientes (SQL)',
          tabBarLabel: 'Clientes (SQL)',
          headerTitle: 'EasyShop • Clientes (SQL Local)',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'people' : 'people-outline'}
              size={size}
              color={focused ? '#1e40af' : typeof color === 'string' ? color : '#64748b'}
            />
          ),
        }}
      />

      {/* Aba 2: Produtos (NoSQL Local) */}
      <Tabs.Screen
        name="products"
        options={{
          title: 'Produtos (NoSQL)',
          tabBarLabel: 'Produtos (NoSQL)',
          headerTitle: 'EasyShop • Catálogo (NoSQL Local)',
          tabBarActiveTintColor: '#059669',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'cube' : 'cube-outline'}
              size={size}
              color={focused ? '#059669' : typeof color === 'string' ? color : '#64748b'}
            />
          ),
        }}
      />

      {/* Aba 3: Arquitetura & Explicação do Desafio */}
      <Tabs.Screen
        name="architecture"
        options={{
          title: 'Arquitetura',
          tabBarLabel: 'Arquitetura',
          headerTitle: 'EasyShop • Persistência Poliglota',
          tabBarActiveTintColor: '#4f46e5',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'layers' : 'layers-outline'}
              size={size}
              color={focused ? '#4f46e5' : typeof color === 'string' ? color : '#64748b'}
            />
          ),
        }}
      />
    </Tabs>
  );
}
