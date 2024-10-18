import {
  BarChart2Icon,
  Bell,
  BookOpen,
  Wallet,
  FileArchive,
  FileTextIcon,
  Home,
  Settings,
  ShieldIcon,
  Users,
  LucideProps,
  Users2
} from "lucide-react"

export const HELP_SHORTCUTS = [
  {
    label: "Aplicativo",
    shortcuts: [
      {
        keys: ["?"],
        keySeparator: "",
        label: "Exibe todos os atalhos de teclado disponíveis nesta página"
      },
      {
        keys: ["ctrl+h"],
        keySeparator: "",
        label: "Abre barra de ajuda lateral"
      },
      {
        keys: ["y"],
        keySeparator: "",
        label: "Notificações"
      },
      {
        keys: ["s"],
        keySeparator: "",
        label: "Suporte"
      },
      {
        keys: ["/"],
        keySeparator: "",
        label: "Pesquisar"
      }
    ]
  },
  {
    label: "Navegação",
    shortcuts: [
      {
        keys: ["g", "h"],
        keySeparator: "e",
        label: "Página inicial"
      },
      {
        keys: ["g", "p"],
        keySeparator: "e",
        label: "Pagamentos"
      },
      {
        keys: ["g", "d"],
        keySeparator: "e",
        label: "Disputas"
      },
      {
        keys: ["g", "b"],
        keySeparator: "e",
        label: "Saldos"
      },
      {
        keys: ["g", "o"],
        keySeparator: "e",
        label: "Repasses"
      },
      {
        keys: ["g", "c"],
        keySeparator: "e",
        label: "Clientes"
      },
      {
        keys: ["g", "r"],
        keySeparator: "e",
        label: "Análises"
      },
      {
        keys: ["g", "t"],
        keySeparator: "e",
        label: "Imposto"
      },
      {
        keys: ["g", "i"],
        keySeparator: "e",
        label: "Faturas"
      },
      {
        keys: ["g", "s"],
        keySeparator: "e",
        label: "Assinaturas"
      },
      {
        keys: ["g", "m"],
        keySeparator: "e",
        label: "Connect"
      },
      {
        keys: ["g", ","],
        keySeparator: "e",
        label: "Configurações"
      }
    ]
  },
  {
    label: "Criar",
    shortcuts: [
      {
        keys: ["c", "i"],
        keySeparator: "e",
        label: "Criar fatura"
      },
      {
        keys: ["c", "i"],
        keySeparator: "e",
        label: "Criar pagamento"
      },
      {
        keys: ["c", "i"],
        keySeparator: "e",
        label: "Criar assinatura"
      },
      {
        keys: ["c", "i"],
        keySeparator: "e",
        label: "Criar link de pagamento"
      },
      {
        keys: ["c", "i"],
        keySeparator: "e",
        label: "Criar repasse"
      }
    ]
  }
]

export type SidebarLink = {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >
  text: string
  link: string
}

export const SIDEBAR_LINKS = [
  {
    label: "",
    links: [
      {
        icon: Home,
        text: "Página inicial",
        link: "/"
      },
      {
        icon: FileArchive,
        text: "Apólices",
        link: "/apolices"
      },
      {
        icon: Users,
        text: "Clientes",
        link: "/clientes"
      },
      {
        icon: FileTextIcon,
        text: "Sinistros",
        link: "/sinistros"
      },
      {
        icon: Wallet,
        text: "Pagamentos",
        link: "/pagamentos"
      },
      {
        icon: BarChart2Icon,
        text: "Relatórios",
        link: "/relatorios"
      },
      {
        icon: ShieldIcon,
        text: "Segurança e Acesso",
        link: "/seguranca"
      }
    ]
  },
  {
    label: "Configurações",
    links: [
      {
        icon: Settings,
        text: "Configurações",
        link: "/configuracoes"
      },
      {
        icon: Bell,
        text: "Notificações",
        link: "/notificacoes"
      },
      {
        icon: BookOpen,
        text: "Documentação",
        link: "/documentacao"
      }
    ]
  },
  {
    onlyManager: true,
    label: "Administração",
    links: [
      {
        icon: Users2,
        text: "Usuários",
        link: "/usuarios"
      }
    ]
  }
]
