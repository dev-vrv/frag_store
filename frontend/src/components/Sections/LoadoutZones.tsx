"use client";

import { ArrowLeft, ArrowRight, Headphones, Keyboard, Mouse, Usb, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  CyberBadge,
  CyberButton,
  CyberDialog,
  CyberDialogClose,
  CyberDialogContent,
  CyberDialogDescription,
  CyberDialogFooter,
  CyberDialogHeader,
  CyberDialogTitle,
} from "@/components/cyber";
import { Section } from "@/components/Sections/Section";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import AnimatedText from "@/components/ui/animatedText";
import { type Dictionary, type Locale, localizePath } from "@/lib/i18n";
import { getLocalizedCategoryName, type ProductCategory } from "@/lib/products";
import { cn } from "@/lib/utils";

const zoneIcons: LucideIcon[] = [Headphones, Keyboard, Mouse, Usb];
const zoneSlugs = ["headsets", "keyboards", "mice", "accessories"];
const zoneThemes = [
  {
    glow: "from-red-500/26 via-red-500/6 to-cyan-300/18",
    ring: "border-red-300/24",
    pulse: "bg-red-400/18",
    line: "via-red-300/80",
    stat: "text-red-100",
    chip: "text-red-100",
    chipBorder: "border-red-300/24",
    chipBg: "bg-red-500/10",
    orb: "bg-[radial-gradient(circle,rgba(255,72,102,0.38),rgba(255,72,102,0.08)_45%,transparent_70%)]",
  },
  {
    glow: "from-fuchsia-500/22 via-fuchsia-500/5 to-cyan-300/18",
    ring: "border-fuchsia-300/24",
    pulse: "bg-fuchsia-400/18",
    line: "via-fuchsia-300/80",
    stat: "text-fuchsia-100",
    chip: "text-fuchsia-100",
    chipBorder: "border-fuchsia-300/24",
    chipBg: "bg-fuchsia-500/10",
    orb: "bg-[radial-gradient(circle,rgba(217,70,239,0.34),rgba(217,70,239,0.08)_45%,transparent_70%)]",
  },
  {
    glow: "from-cyan-500/22 via-cyan-500/5 to-sky-300/18",
    ring: "border-cyan-300/24",
    pulse: "bg-cyan-300/18",
    line: "via-cyan-300/80",
    stat: "text-cyan-100",
    chip: "text-cyan-100",
    chipBorder: "border-cyan-300/24",
    chipBg: "bg-cyan-300/10",
    orb: "bg-[radial-gradient(circle,rgba(34,211,238,0.34),rgba(34,211,238,0.08)_45%,transparent_70%)]",
  },
  {
    glow: "from-lime-500/20 via-lime-500/5 to-cyan-300/18",
    ring: "border-lime-300/24",
    pulse: "bg-lime-300/18",
    line: "via-lime-300/80",
    stat: "text-lime-100",
    chip: "text-lime-100",
    chipBorder: "border-lime-300/24",
    chipBg: "bg-lime-300/10",
    orb: "bg-[radial-gradient(circle,rgba(163,230,53,0.28),rgba(163,230,53,0.07)_45%,transparent_70%)]",
  },
] as const;

const loadoutDetails: Record<
  Locale,
  Record<
    string,
    {
      eyebrow: string;
      title: string;
      summary: string;
      accent: string;
      shell: string;
      glow: string;
      statTone: string;
      statSurface: string;
      technologyTone: string;
      useCaseLabel: string;
      useCase: string;
      idealForLabel: string;
      idealFor: string;
      stats: { label: string; value: string }[];
      technologies: string[];
      button: string;
      technologiesLabel: string;
    }
  >
> = {
  ru: {
    headsets: {
      eyebrow: "Audio stack",
      title: "Гарнитуры",
      summary:
        "Гарнитура отвечает не только за звук, но и за позиционирование шагов, чистоту связи и комфорт в долгих сессиях. Для соревновательной игры важны сцена, микрофон и точная передача верхних и средних частот.",
      accent: "text-red-100",
      shell:
        "border-red-300/24 bg-[radial-gradient(circle_at_16%_18%,rgba(255,23,68,0.18),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(34,211,238,0.12),transparent_24%),linear-gradient(180deg,rgba(10,8,12,0.98),rgba(5,5,8,0.98))]",
      glow: "bg-[linear-gradient(135deg,rgba(255,23,68,0.12),transparent_42%,rgba(34,211,238,0.08))]",
      statTone: "text-red-100",
      statSurface: "border-red-300/24 bg-red-500/10",
      technologyTone: "border-red-300/18 bg-red-500/[0.06]",
      useCaseLabel: "Сценарий",
      useCase: "Тактические шутеры, ranked-матчи и долгие сессии, где важны footsteps, stage и стабильная коммуникация.",
      idealForLabel: "Подходит для",
      idealFor: "Игроков, которым нужен упор на позиционку, микрофон и комфорт без перегруза по низким частотам.",
      stats: [
        { label: "Фокус", value: "Positioning" },
        { label: "Приоритет", value: "Mic clarity" },
        { label: "Сессия", value: "6h+" },
      ],
      technologies: [
        "Virtual 7.1 и spatial audio для точного позиционирования",
        "ENC и AI noise suppression для чистого голосового чата",
        "Low-latency wireless 2.4 GHz для игры без заметной задержки",
      ],
      button: "Подробнее",
      technologiesLabel: "Ключевые технологии",
    },
    keyboards: {
      eyebrow: "Input response",
      title: "Клавиатуры",
      summary:
        "Современные клавиатуры важны не только по ощущениям, но и по скорости срабатывания, типу свитчей и гибкости кастомизации. Хорошая board влияет на темп игры и уверенность в каждом нажатии.",
      accent: "text-fuchsia-100",
      shell:
        "border-fuchsia-300/24 bg-[radial-gradient(circle_at_14%_20%,rgba(217,70,239,0.16),transparent_30%),radial-gradient(circle_at_84%_14%,rgba(96,165,250,0.10),transparent_22%),linear-gradient(180deg,rgba(10,7,14,0.98),rgba(5,5,8,0.98))]",
      glow: "bg-[linear-gradient(135deg,rgba(217,70,239,0.12),transparent_42%,rgba(96,165,250,0.08))]",
      statTone: "text-fuchsia-100",
      statSurface: "border-fuchsia-300/24 bg-fuchsia-500/10",
      technologyTone: "border-fuchsia-300/18 bg-fuchsia-500/[0.06]",
      useCaseLabel: "Сценарий",
      useCase: "Шутеры, MOBA и rhythm-heavy игры, где ценится быстрый reset, предсказуемое усилие и кастомный feel.",
      idealForLabel: "Подходит для",
      idealFor: "Тех, кто хочет собрать board под себя: от свитчей и стабилизаторов до шумки и профиля кейкапов.",
      stats: [
        { label: "Фокус", value: "Actuation" },
        { label: "Гибкость", value: "Hot-swap" },
        { label: "Контроль", value: "Tactile feel" },
      ],
      technologies: [
        "Hot-swap плата для быстрой замены свитчей",
        "Rapid trigger и fast actuation для шутеров и ритм-игр",
        "Заводская шумоизоляция, PBT keycaps и стабилизаторы нового уровня",
      ],
      button: "Подробнее",
      technologiesLabel: "Ключевые технологии",
    },
    mice: {
      eyebrow: "Tracking core",
      title: "Игровые мыши",
      summary:
        "Для мыши критичны форма, вес, сенсор и стабильность клика. Под разные хваты и жанры подбираются разные корпуса, чтобы контроль и скорость реально ощущались в матче.",
      accent: "text-cyan-100",
      shell:
        "border-cyan-300/24 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(14,165,233,0.12),transparent_22%),linear-gradient(180deg,rgba(5,10,16,0.98),rgba(3,6,10,0.98))]",
      glow: "bg-[linear-gradient(135deg,rgba(34,211,238,0.12),transparent_42%,rgba(96,165,250,0.08))]",
      statTone: "text-cyan-100",
      statSurface: "border-cyan-300/24 bg-cyan-500/10",
      technologyTone: "border-cyan-300/18 bg-cyan-500/[0.06]",
      useCaseLabel: "Сценарий",
      useCase: "Aim-heavy дисциплины и быстрые арены, где форма, сенсор и latency напрямую влияют на win condition.",
      idealForLabel: "Подходит для",
      idealFor: "Игроков, которые подбирают мышь под grip-style, вес корпуса и стабильность трекинга на конкретном коврике.",
      stats: [
        { label: "Фокус", value: "Sensor" },
        { label: "Частота", value: "4K ready" },
        { label: "Вес", value: "Ultra-light" },
      ],
      technologies: [
        "Флагманские сенсоры 26K+ DPI с высокой стабильностью трекинга",
        "Оптические свитчи с быстрым откликом и долгим ресурсом",
        "Сверхлёгкие корпуса, 4K polling rate и низкая задержка беспроводного канала",
      ],
      button: "Подробнее",
      technologiesLabel: "Ключевые технологии",
    },
    accessories: {
      eyebrow: "Desk control",
      title: "Аксессуары и control-zone",
      summary:
        "Аксессуары собирают стол в единый рабочий контур: коврики, хабы, стойки и кабель-менеджмент влияют на удобство, чистоту сетапа и стабильность повседневного использования.",
      accent: "text-lime-100",
      shell:
        "border-lime-300/24 bg-[radial-gradient(circle_at_18%_18%,rgba(163,230,53,0.14),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(34,211,238,0.10),transparent_22%),linear-gradient(180deg,rgba(8,12,8,0.98),rgba(4,7,6,0.98))]",
      glow: "bg-[linear-gradient(135deg,rgba(163,230,53,0.12),transparent_42%,rgba(34,211,238,0.08))]",
      statTone: "text-lime-100",
      statSurface: "border-lime-300/24 bg-lime-500/10",
      technologyTone: "border-lime-300/18 bg-lime-500/[0.06]",
      useCaseLabel: "Сценарий",
      useCase: "Setup-сборка, productivity + gaming desk и аккуратная периферийная разводка без хаоса на столе.",
      idealForLabel: "Подходит для",
      idealFor: "Тех, кто хочет не просто отдельные девайсы, а собранную control-zone с логичной эргономикой.",
      stats: [
        { label: "Фокус", value: "Ergonomics" },
        { label: "Зона", value: "Cable flow" },
        { label: "Эффект", value: "Desk order" },
      ],
      technologies: [
        "Surface tuning у ковриков под speed и control сценарии",
        "USB-хабы с питанием и стабильной периферийной разводкой",
        "Desk setup-модули: держатели, cable routing и ergonomic add-ons",
      ],
      button: "Подробнее",
      technologiesLabel: "Ключевые технологии",
    },
  },
  en: {
    headsets: {
      eyebrow: "Audio stack",
      title: "Gaming headsets",
      summary:
        "A headset shapes positional awareness, call clarity, and long-session comfort. Competitive play depends on staging, mic quality, and consistent reproduction across highs and mids.",
      accent: "text-red-100",
      shell:
        "border-red-300/24 bg-[radial-gradient(circle_at_16%_18%,rgba(255,23,68,0.18),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(34,211,238,0.12),transparent_24%),linear-gradient(180deg,rgba(10,8,12,0.98),rgba(5,5,8,0.98))]",
      glow: "bg-[linear-gradient(135deg,rgba(255,23,68,0.12),transparent_42%,rgba(34,211,238,0.08))]",
      statTone: "text-red-100",
      statSurface: "border-red-300/24 bg-red-500/10",
      technologyTone: "border-red-300/18 bg-red-500/[0.06]",
      useCaseLabel: "Use case",
      useCase: "Tactical shooters, ranked ladders, and long sessions where footsteps, stage, and stable voice comms matter most.",
      idealForLabel: "Ideal for",
      idealFor: "Players prioritizing positional detail, microphone quality, and comfort without muddy low-end tuning.",
      stats: [
        { label: "Focus", value: "Positioning" },
        { label: "Priority", value: "Mic clarity" },
        { label: "Session", value: "6h+" },
      ],
      technologies: [
        "Virtual 7.1 and spatial audio for stronger positional cues",
        "ENC and AI noise suppression for cleaner voice chat",
        "Low-latency 2.4 GHz wireless for near-instant in-game response",
      ],
      button: "Details",
      technologiesLabel: "Key technologies",
    },
    keyboards: {
      eyebrow: "Input response",
      title: "Gaming keyboards",
      summary:
        "Modern keyboards matter for more than feel. Switch behavior, actuation speed, and customization depth directly affect pace, consistency, and confidence in game.",
      accent: "text-fuchsia-100",
      shell:
        "border-fuchsia-300/24 bg-[radial-gradient(circle_at_14%_20%,rgba(217,70,239,0.16),transparent_30%),radial-gradient(circle_at_84%_14%,rgba(96,165,250,0.10),transparent_22%),linear-gradient(180deg,rgba(10,7,14,0.98),rgba(5,5,8,0.98))]",
      glow: "bg-[linear-gradient(135deg,rgba(217,70,239,0.12),transparent_42%,rgba(96,165,250,0.08))]",
      statTone: "text-fuchsia-100",
      statSurface: "border-fuchsia-300/24 bg-fuchsia-500/10",
      technologyTone: "border-fuchsia-300/18 bg-fuchsia-500/[0.06]",
      useCaseLabel: "Use case",
      useCase: "Shooters, MOBAs, and rhythm-heavy games where fast reset, predictable force, and tuned feel improve consistency.",
      idealForLabel: "Ideal for",
      idealFor: "People building a board around their own preferences, from switches and stabilizers to dampening and cap profile.",
      stats: [
        { label: "Focus", value: "Actuation" },
        { label: "Flex", value: "Hot-swap" },
        { label: "Control", value: "Tactile feel" },
      ],
      technologies: [
        "Hot-swap boards for quick switch changes",
        "Rapid trigger and fast actuation for shooters and rhythm-heavy play",
        "Factory dampening, PBT caps, and upgraded stabilizers",
      ],
      button: "Details",
      technologiesLabel: "Key technologies",
    },
    mice: {
      eyebrow: "Tracking core",
      title: "Gaming mice",
      summary:
        "For a mouse, shape, weight, sensor quality, and click stability are decisive. Different grips and genres need different shells to maximize control and speed.",
      accent: "text-cyan-100",
      shell:
        "border-cyan-300/24 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(14,165,233,0.12),transparent_22%),linear-gradient(180deg,rgba(5,10,16,0.98),rgba(3,6,10,0.98))]",
      glow: "bg-[linear-gradient(135deg,rgba(34,211,238,0.12),transparent_42%,rgba(96,165,250,0.08))]",
      statTone: "text-cyan-100",
      statSurface: "border-cyan-300/24 bg-cyan-500/10",
      technologyTone: "border-cyan-300/18 bg-cyan-500/[0.06]",
      useCaseLabel: "Use case",
      useCase: "Aim-heavy games and fast arenas where shell shape, sensor trust, and latency directly affect execution.",
      idealForLabel: "Ideal for",
      idealFor: "Players choosing a mouse around grip style, body weight, and stable tracking on a specific pad surface.",
      stats: [
        { label: "Focus", value: "Sensor" },
        { label: "Polling", value: "4K ready" },
        { label: "Weight", value: "Ultra-light" },
      ],
      technologies: [
        "Flagship 26K+ DPI sensors with stable tracking",
        "Optical switches with fast response and long lifespan",
        "Ultra-light shells, 4K polling, and low-latency wireless links",
      ],
      button: "Details",
      technologiesLabel: "Key technologies",
    },
    accessories: {
      eyebrow: "Desk control",
      title: "Accessories and control zone",
      summary:
        "Accessories turn a desk into a coherent work and play environment. Pads, hubs, stands, and cable routing affect comfort, cleanliness, and daily reliability.",
      accent: "text-lime-100",
      shell:
        "border-lime-300/24 bg-[radial-gradient(circle_at_18%_18%,rgba(163,230,53,0.14),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(34,211,238,0.10),transparent_22%),linear-gradient(180deg,rgba(8,12,8,0.98),rgba(4,7,6,0.98))]",
      glow: "bg-[linear-gradient(135deg,rgba(163,230,53,0.12),transparent_42%,rgba(34,211,238,0.08))]",
      statTone: "text-lime-100",
      statSurface: "border-lime-300/24 bg-lime-500/10",
      technologyTone: "border-lime-300/18 bg-lime-500/[0.06]",
      useCaseLabel: "Use case",
      useCase: "Desk builds, hybrid work and play stations, and cleaner peripheral routing without setup clutter.",
      idealForLabel: "Ideal for",
      idealFor: "Anyone building a coherent control zone instead of collecting disconnected accessories.",
      stats: [
        { label: "Focus", value: "Ergonomics" },
        { label: "Zone", value: "Cable flow" },
        { label: "Effect", value: "Desk order" },
      ],
      technologies: [
        "Mousepad surface tuning for speed and control use cases",
        "Powered USB hubs with more stable peripheral routing",
        "Desk modules for holders, cable management, and ergonomic additions",
      ],
      button: "Details",
      technologiesLabel: "Key technologies",
    },
  },
  kg: {
    headsets: {
      eyebrow: "Audio stack",
      title: "Оюн гарнитуралары",
      summary:
        "Гарнитура үндөн тышкары позицияны угууга, таза байланышка жана узак сессиядагы комфортко таасир берет. Сахнасы, микрофону жана деталдары маанилүү.",
      accent: "text-red-100",
      shell:
        "border-red-300/24 bg-[radial-gradient(circle_at_16%_18%,rgba(255,23,68,0.18),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(34,211,238,0.12),transparent_24%),linear-gradient(180deg,rgba(10,8,12,0.98),rgba(5,5,8,0.98))]",
      glow: "bg-[linear-gradient(135deg,rgba(255,23,68,0.12),transparent_42%,rgba(34,211,238,0.08))]",
      statTone: "text-red-100",
      statSurface: "border-red-300/24 bg-red-500/10",
      technologyTone: "border-red-300/18 bg-red-500/[0.06]",
      useCaseLabel: "Колдонуу",
      useCase: "Тактикалык шутерлер, ranked-оюндар жана footsteps менен үн байланыш маанилүү болгон узак сессиялар.",
      idealForLabel: "Кимге ылайыктуу",
      idealFor: "Позициялык үн, микрофон сапаты жана комфортту биринчи орунга койгон оюнчуларга.",
      stats: [
        { label: "Фокус", value: "Positioning" },
        { label: "Артыкчылык", value: "Mic clarity" },
        { label: "Сессия", value: "6h+" },
      ],
      technologies: [
        "Так позиция үчүн virtual 7.1 жана spatial audio",
        "Таза үн үчүн ENC жана AI noise suppression",
        "Кечигүүсү аз 2.4 GHz wireless байланыш",
      ],
      button: "Кененирээк",
      technologiesLabel: "Негизги технологиялар",
    },
    keyboards: {
      eyebrow: "Input response",
      title: "Оюн клавиатуралары",
      summary:
        "Клавиатура сезим гана эмес, басуу ылдамдыгы, свитч мүнөзү жана настройка мүмкүнчүлүгү менен да маанилүү. Бул оюн темпине түз таасир этет.",
      accent: "text-fuchsia-100",
      shell:
        "border-fuchsia-300/24 bg-[radial-gradient(circle_at_14%_20%,rgba(217,70,239,0.16),transparent_30%),radial-gradient(circle_at_84%_14%,rgba(96,165,250,0.10),transparent_22%),linear-gradient(180deg,rgba(10,7,14,0.98),rgba(5,5,8,0.98))]",
      glow: "bg-[linear-gradient(135deg,rgba(217,70,239,0.12),transparent_42%,rgba(96,165,250,0.08))]",
      statTone: "text-fuchsia-100",
      statSurface: "border-fuchsia-300/24 bg-fuchsia-500/10",
      technologyTone: "border-fuchsia-300/18 bg-fuchsia-500/[0.06]",
      useCaseLabel: "Колдонуу",
      useCase: "Шутерлер, MOBA жана тез реакция керек болгон оюндар үчүн басуу тактыгы жана feel маанилүү.",
      idealForLabel: "Кимге ылайыктуу",
      idealFor: "Свитч, стабилизатор, шумка жана кейкап профилин өзүнө жараша тандагысы келгендерге.",
      stats: [
        { label: "Фокус", value: "Actuation" },
        { label: "Ийкем", value: "Hot-swap" },
        { label: "Контроль", value: "Tactile feel" },
      ],
      technologies: [
        "Свитчтерди тез алмаштыруу үчүн hot-swap плата",
        "Шутерлер үчүн rapid trigger жана fast actuation",
        "Шумоизоляция, PBT keycaps жана сапаттуу стабилизаторлор",
      ],
      button: "Кененирээк",
      technologiesLabel: "Негизги технологиялар",
    },
    mice: {
      eyebrow: "Tracking core",
      title: "Оюн чычкандары",
      summary:
        "Чычкан үчүн форма, салмак, сенсор жана клик туруктуулугу чечүүчү мааниге ээ. Ар башка жанр жана хват үчүн өзүнүн мыкты формасы бар.",
      accent: "text-cyan-100",
      shell:
        "border-cyan-300/24 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(14,165,233,0.12),transparent_22%),linear-gradient(180deg,rgba(5,10,16,0.98),rgba(3,6,10,0.98))]",
      glow: "bg-[linear-gradient(135deg,rgba(34,211,238,0.12),transparent_42%,rgba(96,165,250,0.08))]",
      statTone: "text-cyan-100",
      statSurface: "border-cyan-300/24 bg-cyan-500/10",
      technologyTone: "border-cyan-300/18 bg-cyan-500/[0.06]",
      useCaseLabel: "Колдонуу",
      useCase: "Aim талап кылган дисциплиналарда форма, сенсор жана кечигүү түздөн-түз натыйжага таасир берет.",
      idealForLabel: "Кимге ылайыктуу",
      idealFor: "Grip-style, салмак жана конкреттүү коврик менен туруктуу трекингди так тандаган оюнчуларга.",
      stats: [
        { label: "Фокус", value: "Sensor" },
        { label: "Rate", value: "4K ready" },
        { label: "Салмак", value: "Ultra-light" },
      ],
      technologies: [
        "Туруктуу трекинг менен 26K+ DPI сенсорлор",
        "Тез жооп берген оптикалык свитчтер",
        "Жеңил корпус, 4K polling rate жана кечигүүсү аз wireless",
      ],
      button: "Кененирээк",
      technologiesLabel: "Негизги технологиялар",
    },
    accessories: {
      eyebrow: "Desk control",
      title: "Аксессуарлар жана control-zone",
      summary:
        "Аксессуарлар столду бирдиктүү аймакка айландырат: коврик, хаб, кармагыч жана кабель-менеджмент комфортту жана тартипти жакшыртат.",
      accent: "text-lime-100",
      shell:
        "border-lime-300/24 bg-[radial-gradient(circle_at_18%_18%,rgba(163,230,53,0.14),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(34,211,238,0.10),transparent_22%),linear-gradient(180deg,rgba(8,12,8,0.98),rgba(4,7,6,0.98))]",
      glow: "bg-[linear-gradient(135deg,rgba(163,230,53,0.12),transparent_42%,rgba(34,211,238,0.08))]",
      statTone: "text-lime-100",
      statSurface: "border-lime-300/24 bg-lime-500/10",
      technologyTone: "border-lime-300/18 bg-lime-500/[0.06]",
      useCaseLabel: "Колдонуу",
      useCase: "Жумуш жана оюн бириккен setup, периферияны таза жайгаштыруу жана столдогу тартип үчүн.",
      idealForLabel: "Кимге ылайыктуу",
      idealFor: "Жөн гана аксессуар эмес, логикалык жана ыңгайлуу control-zone кургусу келгендерге.",
      stats: [
        { label: "Фокус", value: "Ergonomics" },
        { label: "Зона", value: "Cable flow" },
        { label: "Натыйжа", value: "Desk order" },
      ],
      technologies: [
        "Speed жана control үчүн ар башка surface tuning",
        "Туруктуу туташуу үчүн powered USB-хабдар",
        "Кармагычтар, cable routing жана ergonomic add-ons",
      ],
      button: "Кененирээк",
      technologiesLabel: "Негизги технологиялар",
    },
  },
};

export interface LoadoutZonesProps {
  locale: Locale;
  content: Dictionary["loadout"];
  categories: ProductCategory[];
}

function formatCategoryVariantsCount(count: number, locale: Locale) {
  if (locale === "en") {
    return `${count} items`;
  }

  if (locale === "kg") {
    return `${count} вариант`;
  }

  return `${count} позиций`;
}

export function LoadoutZones({ locale, content, categories }: LoadoutZonesProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [animationStage, setAnimationStage] = useState<"idle" | "exit" | "enter">("idle");
  const [animationDirection, setAnimationDirection] = useState<1 | -1>(1);
  const animationTimerRef = useRef<number | null>(null);
  const activeDetails = activeSlug ? loadoutDetails[locale][activeSlug] : null;
  const activeIndex = activeSlug ? zoneSlugs.indexOf(activeSlug) : -1;
  const previousIndex = activeIndex === -1 ? -1 : (activeIndex - 1 + zoneSlugs.length) % zoneSlugs.length;
  const nextIndex = activeIndex === -1 ? -1 : (activeIndex + 1) % zoneSlugs.length;
  const previousSlug = previousIndex === -1 ? null : zoneSlugs[previousIndex];
  const nextSlug = nextIndex === -1 ? null : zoneSlugs[nextIndex];

  useEffect(() => {
    return () => {
      if (animationTimerRef.current !== null) {
        window.clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  const navigateModal = (targetSlug: string | null, direction: 1 | -1) => {
    if (!targetSlug || targetSlug === activeSlug || animationStage !== "idle") {
      return;
    }

    if (animationTimerRef.current !== null) {
      window.clearTimeout(animationTimerRef.current);
    }

    setAnimationDirection(direction);
    setAnimationStage("exit");

    animationTimerRef.current = window.setTimeout(() => {
      setActiveSlug(targetSlug);
      setAnimationStage("enter");

      animationTimerRef.current = window.setTimeout(() => {
        setAnimationStage("idle");
        animationTimerRef.current = null;
      }, 220);
    }, 180);
  };

  const modalAnimationClass =
    animationStage === "idle"
      ? "translate-x-0 opacity-100 blur-0"
      : animationStage === "exit"
        ? animationDirection === 1
          ? "-translate-x-6 opacity-0 blur-[6px]"
          : "translate-x-6 opacity-0 blur-[6px]"
        : animationDirection === 1
          ? "translate-x-6 opacity-0 blur-[6px] animate-[loadout-modal-enter_220ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
          : "-translate-x-6 opacity-0 blur-[6px] animate-[loadout-modal-enter_220ms_cubic-bezier(0.22,1,0.36,1)_forwards]";

  return (
    <Section
      id="loadout"
      fullWidth
      className="relative isolate overflow-hidden bg-transparent text-zinc-50"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(84%_48%_at_-10%_22%,rgba(255,23,68,0.08),transparent_62%),radial-gradient(90%_52%_at_110%_18%,rgba(34,211,238,0.08),transparent_62%),radial-gradient(68%_38%_at_48%_110%,rgba(217,70,239,0.04),transparent_64%),linear-gradient(180deg,rgba(1,1,3,0.02)_0%,rgba(2,2,4,0.15)_20%,rgba(2,2,4,0.15)_80%,rgba(1,1,3,0.03)_100%)]" />
      <style jsx>{`
        @keyframes loadout-modal-enter {
          from {
            transform: translate3d(var(--loadout-enter-x, 0), 0, 0);
            opacity: 0;
            filter: blur(6px);
          }
          to {
            transform: translate3d(0, 0, 0);
            opacity: 1;
            filter: blur(0);
          }
        }
      `}</style>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:gap-10">
        <div className="flex flex-col items-center text-center">
          <RevealOnScroll as="div" delay={80}>
            <CyberBadge variant="red" glow>
              {content.eyebrow}
            </CyberBadge>
          </RevealOnScroll>
          <AnimatedText
            as="h2"
            text={content.title}
            delay={180}
            className="font-display mt-6 max-w-4xl text-[2rem] font-normal leading-[1.08] tracking-[0.02em] text-white sm:text-[2.6rem] lg:text-5xl"
            config={{ duration: 0.32, delayStep: 16, distance: 24 }}
          />
          <RevealOnScroll className="mt-7 flex justify-center" delay={420}>
            <CyberButton asChild variant="ghost" className="w-full sm:w-auto">
              <a href={localizePath("/contacts", locale)}>{content.secondaryCta}</a>
            </CyberButton>
          </RevealOnScroll>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {content.cards.map((card, index) => {
            const Icon = zoneIcons[index];
            const categorySlug = zoneSlugs[index] ?? "all";
            const categoryHref = `${localizePath("/catalog", locale)}?category=${categorySlug}`;
            const details = loadoutDetails[locale][categorySlug];
            const theme = zoneThemes[index] ?? zoneThemes[0];
            const category = categories.find((item) => item.slug === categorySlug);
            const categoryStat = formatCategoryVariantsCount(category?.products_count ?? 0, locale);
            const categoryTitle = category ? getLocalizedCategoryName(category, locale) : card.title;

            return (
              <RevealOnScroll
                key={card.title}
                as="article"
                delay={620 + index * 120}
                className="group/loadout-card relative z-0 h-full transition-[z-index] duration-0 hover:z-10 focus-within:z-10"
              >
                <div className="relative isolate h-full translate-y-0 overflow-hidden rounded-md border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02),0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-[transform,border-color,box-shadow,background-color] duration-500 ease-out will-change-transform transform-gpu group-hover/loadout-card:-translate-y-[3px] group-hover/loadout-card:border-white/14 group-hover/loadout-card:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_30px_70px_rgba(0,0,0,0.28)] sm:rounded-md sm:p-6">
                  <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90 transition-opacity duration-500 ease-out group-hover/loadout-card:opacity-100", theme.glow)} />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,10,0.08),rgba(6,6,10,0.42)_54%,rgba(6,6,10,0.82))]" />
                  <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] transition-opacity duration-500 ease-out group-hover/loadout-card:opacity-70" />
                  <div className={cn("pointer-events-none absolute -right-10 top-6 h-32 w-32 translate-x-0 scale-100 rounded-full blur-3xl transition-transform duration-500 ease-out will-change-transform group-hover/loadout-card:translate-x-1 group-hover/loadout-card:scale-105", theme.orb)} />
                  <div className="pointer-events-none absolute -left-6 bottom-10 h-20 w-20 scale-100 rounded-full bg-white/8 opacity-40 blur-2xl transition-transform duration-500 ease-out will-change-transform group-hover/loadout-card:scale-105" />
                  <div className={cn("pointer-events-none absolute inset-x-6 top-0 h-px opacity-70 bg-gradient-to-r from-transparent to-transparent transition-opacity duration-400 ease-out group-hover/loadout-card:opacity-100", theme.line)} />
                  <div className="pointer-events-none absolute right-6 top-6 h-14 w-14 scale-100 rounded-full border border-white/10 opacity-40 transition-all duration-500 ease-out will-change-transform group-hover/loadout-card:scale-105 group-hover/loadout-card:opacity-80" />
                  <div className="pointer-events-none absolute left-6 top-24 right-6 h-px origin-left scale-x-0 bg-gradient-to-r from-white/0 via-white/18 to-white/0 transition-transform duration-500 ease-out will-change-transform group-hover/loadout-card:scale-x-100" />

                  <div className="relative z-10 max-w-7xl mx-auto flex h-full flex-col">
                    <div className="flex items-center justify-between gap-4">
                      <div className="relative">
                        <div className={cn("pointer-events-none absolute inset-0 rounded-md blur-xl transition-transform duration-500 ease-out group-hover/loadout-card:scale-105", theme.pulse)} />
                        <div className={cn("relative flex size-12 items-center justify-center rounded-md border bg-black/45 shadow-[0_0_24px_rgba(0,0,0,0.2)] transition-[transform,border-color,box-shadow,background-color] duration-500 ease-out group-hover/loadout-card:scale-[1.02] group-hover/loadout-card:bg-black/52 sm:size-14 sm:rounded-md", theme.ring)}>
                          <Icon className="size-6 transition-transform duration-500 ease-out group-hover/loadout-card:-translate-y-px group-hover/loadout-card:scale-105" />
                        </div>
                      </div>
                      <span className={cn("font-tech text-[11px] uppercase tracking-[0.16em] transition-colors duration-700", theme.chip)}>
                        {card.signal}
                      </span>
                    </div>

                    <div className="mt-6 flex items-center gap-2 sm:mt-8">
                      <span className={cn("h-px flex-1 bg-gradient-to-r from-white/0 to-white/16 transition-all duration-400 ease-out group-hover/loadout-card:to-white/28")} />
                      <span className={cn("font-tech text-[10px] uppercase tracking-[0.18em]", theme.chip)}>
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="mt-5 min-h-[3rem] font-display text-[1.4rem] leading-[1.05] tracking-[0.03em] text-white transition-colors duration-300 ease-out group-hover/loadout-card:text-white sm:min-h-[4.2rem] sm:text-[2rem]">
                      {categoryTitle}
                    </h3>
                    <p className="mt-3 flex-1 min-h-[4.5rem] max-w-[24ch] text-sm leading-6 text-zinc-400 transition-colors duration-300 ease-out group-hover/loadout-card:text-zinc-200 sm:mt-4 sm:min-h-[5.25rem] sm:leading-7">
                      {card.description}
                    </p>

                    <div className="mt-5 grid grid-cols-[1fr_auto] items-center gap-3 border-t border-white/10 pt-4 transition-colors duration-400 ease-out group-hover/loadout-card:border-white/15 sm:mt-6 sm:gap-4 sm:pt-5">
                      <span className="font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                        {content.signalLabel}
                      </span>
                      <span className={cn("font-tech inline-flex items-center rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.14em] transition-colors duration-700", theme.chipBorder, theme.chipBg, theme.stat)}>
                        {categoryStat}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveSlug(categorySlug)}
                        className="font-tech inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-cyan-300/22 bg-cyan-300/[0.07] px-4 text-[11px] uppercase tracking-[0.16em] text-cyan-100 transition-[transform,border-color,background-color,color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-cyan-300/[0.12] hover:text-white hover:shadow-[0_10px_24px_rgba(34,211,238,0.16)]"
                      >
                        {details.button}
                      </button>
                      <a
                        href={categoryHref}
                        className="group/loadout-link font-tech inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.05] px-4 text-[11px] uppercase tracking-[0.16em] text-red-100 transition-[transform,border-color,background-color,color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-white/24 hover:bg-white/[0.08] hover:text-white hover:shadow-[0_10px_24px_rgba(255,255,255,0.08)]"
                        aria-label={`${card.title}: ${content.categoryAriaLabel}`}
                      >
                        {content.categoryCta}
                        <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/loadout-link:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>

      <CyberDialog open={Boolean(activeDetails)} onOpenChange={(open) => !open && setActiveSlug(null)}>
        <CyberDialogContent
          showCloseButton={false}
          className={cn("overflow-hidden p-0 sm:max-w-3xl", activeDetails?.shell)}
        >
          {activeDetails ? (
            <div className="relative">
              <div className={cn("absolute inset-0 opacity-90", activeDetails.glow)} />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:26px_26px] opacity-20" />

              <div
                key={activeSlug}
                className={cn("relative z-10 max-w-7xl mx-auto space-y-8 p-6 transition-[transform,opacity,filter] duration-180 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-8", modalAnimationClass)}
                style={
                  {
                    "--loadout-enter-x": `${animationDirection * 24}px`,
                  } as React.CSSProperties
                }
              >
                <CyberDialogHeader className="space-y-5 text-left">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={cn("font-tech rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em]", activeDetails.statSurface, activeDetails.accent)}>
                      {activeDetails.eyebrow}
                    </span>
                    <div className="h-px min-w-10 flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                    <CyberDialogClose asChild>
                      <button
                        type="button"
                        className="font-tech inline-flex min-h-10 items-center justify-center rounded-full border border-white/14 bg-white/[0.05] px-4 text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:border-white/24 hover:bg-white/[0.09]"
                      >
                        {locale === "en" ? "Close" : locale === "kg" ? "Жабуу" : "Закрыть"}
                      </button>
                    </CyberDialogClose>
                  </div>
                  <CyberDialogTitle className="font-display text-3xl uppercase tracking-[0.05em] text-white sm:text-4xl">
                    {activeDetails.title}
                  </CyberDialogTitle>
                  <CyberDialogDescription className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                    {activeDetails.summary}
                  </CyberDialogDescription>
                </CyberDialogHeader>

                <div className="grid gap-3 sm:grid-cols-3">
                  {activeDetails.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className={cn("rounded-md border px-4 py-4 backdrop-blur", activeDetails.statSurface)}
                    >
                      <p className="font-tech text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                        {stat.label}
                      </p>
                      <p className={cn("mt-2 text-lg font-semibold tracking-[0.03em]", activeDetails.statTone)}>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-md border border-white/10 bg-black/25 p-5 backdrop-blur">
                    <p className={cn("font-tech text-[11px] uppercase tracking-[0.18em]", activeDetails.accent)}>
                      {activeDetails.technologiesLabel}
                    </p>
                    <div className="mt-4 grid gap-3">
                      {activeDetails.technologies.map((item) => (
                        <div
                          key={item}
                          className={cn("rounded-md border px-4 py-3 text-sm leading-6 text-zinc-200", activeDetails.technologyTone)}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-md border border-white/10 bg-white/[0.04] p-5">
                      <p className="font-tech text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                        {activeDetails.useCaseLabel}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-zinc-200">
                        {activeDetails.useCase}
                      </p>
                    </div>
                    <div className="rounded-md border border-white/10 bg-white/[0.04] p-5">
                      <p className="font-tech text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                        {activeDetails.idealForLabel}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-zinc-200">
                        {activeDetails.idealFor}
                      </p>
                    </div>
                  </div>
                </div>

                <CyberDialogFooter className="pt-2 sm:justify-between">
                  <button
                    type="button"
                    onClick={() => navigateModal(previousSlug, -1)}
                    aria-label={content.modalPrev}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-zinc-200 transition-colors hover:border-white/22 hover:bg-white/[0.08] hover:text-white disabled:pointer-events-none disabled:opacity-50"
                    disabled={animationStage !== "idle"}
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateModal(nextSlug, 1)}
                    aria-label={content.modalNext}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-cyan-300/18 bg-cyan-300/[0.06] text-cyan-100 transition-colors hover:border-cyan-300/32 hover:bg-cyan-300/[0.12] hover:text-white disabled:pointer-events-none disabled:opacity-50"
                    disabled={animationStage !== "idle"}
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </CyberDialogFooter>
              </div>
            </div>
          ) : null}
        </CyberDialogContent>
      </CyberDialog>
    </Section>
  );
}
