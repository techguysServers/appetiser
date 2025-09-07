"use client";

import {
  Brain,
  Users,
  Trophy,
  Clock,
  DollarSign,
  Code,
  TrendingUp,
  Lock,
  Languages,
  Archive,
} from "lucide-react";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import Image from "next/image";

type OverviewSectionProps = {
  totalHoursMin: number;
  totalHoursMax: number;
  totalCostMin: number;
  totalCostMax: number;
  stepsCount: number;
};

export default function OverviewSection({
  totalHoursMin,
  totalHoursMax,
  totalCostMin,
  totalCostMax,
  stepsCount,
}: OverviewSectionProps) {
  return (
    <div className="space-y-8 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Aperçu du projet
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 flex items-center gap-2">
                  <Clock className="md:hidden h-4 w-4 text-blue-600" />
                  <span>Total d&apos;heures</span>
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {totalHoursMin}h - {totalHoursMax}h
                </p>
              </div>
              <Clock className="hidden md:block h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 flex items-center gap-2">
                  <DollarSign className="md:hidden h-4 w-4 text-green-600" />
                  <span>Coût total</span>
                </p>
                <p className="text-2xl font-bold text-green-900">
                  ${totalCostMin.toLocaleString()} - $
                  {totalCostMax.toLocaleString()}
                </p>
              </div>
              <DollarSign className="hidden md:block h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 flex items-center gap-2">
                  <Code className="md:hidden h-4 w-4 text-purple-600" />
                  <span>Étapes du projet</span>
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {stepsCount}
                </p>
              </div>
              <Code className="hidden md:block h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-fit bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Fonctionnalités de l&apos;application
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Brain className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-gray-700">Quiz médicaux interactifs</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-gray-700">Défis sociaux et amis</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <Trophy className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-gray-700">Classements et récompenses</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-gray-700">Suivi de progression</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Pile technologique
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative flex size-[250px] flex-col items-center justify-center overflow-hidden">
              <OrbitingCircles radius={100} iconSize={36}>
                <Image
                  src="react.svg"
                  alt="React Native"
                  width={30}
                  height={30}
                />
                <Image src="expo.svg" alt="Expo" width={30} height={30} />
                <Languages size={30} className="text-blue-400" />
              </OrbitingCircles>
              <OrbitingCircles radius={50} iconSize={36} reverse>
                <Image
                  src="supabase.svg"
                  alt="Supabase"
                  width={30}
                  height={30}
                />
                <Image src="psql.svg" alt="PostgreSQL" width={30} height={30} />
              </OrbitingCircles>
            </div>
            <div className="w-full space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-500">Front-end</p>
                <p className="font-medium text-gray-900">React Native + Expo</p>
                <p className="text-sm text-gray-600">
                  Mobile multiplateforme, mises à jour OTA
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm text-gray-500">Back-end</p>
                <p className="font-medium text-gray-900">Supabase</p>
                <p className="text-sm text-gray-600">
                  APIs gérées, temps réel, authentification, stockage
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-sm text-gray-500">Base de données</p>
                <p className="font-medium text-gray-900">
                  PostgreSQL (Supabase)
                </p>
                <p className="text-sm text-gray-600">
                  Schéma relationnel, sécurité au niveau des lignes
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Authentification
              </p>
              <p className="font-medium text-gray-900">Supabase Auth</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Archive className="w-4 h-4" />
                Stockage
              </p>
              <p className="font-medium text-gray-900">Supabase Buckets</p>
            </div>
            <div className="border rounded-lg p-3 col-span-2">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Languages className="w-4 h-4" />
                Langues
              </p>
              <p className="font-medium text-gray-900">Français / Anglais</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
