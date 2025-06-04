import { Scene } from '../types';
import { MapPin, Building, Utensils } from 'lucide-react';

export const scenes: Scene[] = [
  {
    id: 'airport',
    name: '机场对话',
    description: '练习问路、值机和机场导航等场景对话。',
    icon: 'MapPin',
    userRole: '旅客',
    aiRole: '机场工作人员',
    initialPrompt: "您好！欢迎来到国际机场。请问需要什么帮助？",
  },
  {
    id: 'hotel',
    name: '酒店入住',
    description: '练习酒店入住、咨询设施和解决问题等场景对话。',
    icon: 'Building',
    userRole: '客人',
    aiRole: '前台接待',
    initialPrompt: "晚上好，欢迎入住豪华酒店。请问有预订吗？",
  },
  {
    id: 'restaurant',
    name: '餐厅点餐',
    description: '练习点餐、询问菜品和特殊要求等场景对话。',
    icon: 'Utensils',
    userRole: '顾客',
    aiRole: '服务员',
    initialPrompt: "您好！欢迎光临。需要看看菜单吗？",
  },
];

export const getSceneIcon = (iconName: string) => {
  switch (iconName) {
    case 'MapPin': return MapPin;
    case 'Building': return Building;
    case 'Utensils': return Utensils;
    default: return MapPin;
  }
};