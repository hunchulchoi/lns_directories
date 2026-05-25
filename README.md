# LNS Directories

Obsidian plugin that links **external files and folders** into your vault using **symbolic links** (`ln -s` on macOS/Linux).

[한국어](#한국어) · [English](#english)

---

## 한국어

### 개요

볼트 밖에 있는 노트·자료를 옮기지 않고, 볼트 안에 심볼릭 링크로 연결합니다. Obsidian 파일 탐색기에서 해당 경로를 일반 폴더/파일처럼 볼 수 있습니다.

### 기능

- **디렉터리 / 파일 연결** — 외부 절대 경로 → 볼트 내 상대 경로에 symlink 생성
- **파일 탐색기 우클릭** — 폴더에서 「심볼디렉토리 추가」「심볼파일 추가」
- **연결 관리** — 설정 탭에서 목록, 상태(정상 / 원본 없음 / 링크 없음 / 깨짐), 제거
- **다국어** — 한국어 / English (설정에서 변경, 기본값은 Obsidian 언어 따름)

### 요구 사항

- **Obsidian 데스크톱** (`isDesktopOnly: true`)
- **로컬 파일 시스템 볼트** (iCloud/동기화 폴더는 OS·동기화 설정에 따라 symlink 동작이 달라질 수 있음)
- macOS / Linux 권장 (Windows는 `mklink` 권한 이슈 가능)

### 설치

#### 수동 설치

1. [Releases](https://github.com/hunchulchoi/lns_directories/releases)에서 `main.js`, `manifest.json`, `styles.css`를 받거나, 저장소를 클론 후 빌드합니다.

```bash
git clone https://github.com/hunchulchoi/lns_directories.git
cd lns_directories
npm install
npm run build
```

2. 볼트의 플러그인 폴더에 복사합니다.

```
<Vault>/.obsidian/plugins/lns-directories/
├── main.js
├── manifest.json
└── styles.css
```

3. Obsidian → **설정 → 커뮤니티 플러그인** → **LNS Directories** 활성화

### 사용 방법

1. **파일 탐색기**에서 대상 **폴더** 우클릭 → **심볼디렉토리 추가** 또는 **심볼파일 추가**
2. **찾아보기**로 외부 경로 선택 (또는 절대 경로 직접 입력)
3. **볼트 내 링크 경로** 확인 (우클릭한 폴더 아래에 `폴더명/원본이름` 형태로 자동 제안)
4. **연결 만들기** 클릭

다른 진입점:

- 사이드바 **링크** 아이콘
- 명령 팔레트: `디렉터리 심볼릭 링크 연결`, `파일 심볼릭 링크 연결`

### 설정

**설정 → LNS Directories**

| 항목 | 설명 |
|------|------|
| 언어 | 자동 / English / 한국어 |
| 연결 목록 | 등록된 symlink 확인·제거 |

언어를 바꾼 뒤 **명령 팔레트 이름**까지 반영하려면 플러그인을 한 번 끄고 켜세요.

### 개발

```bash
npm run dev    # watch 빌드
npm run build  # production 빌드
```

소스는 `src/`, 빌드 결과는 `main.js` (`.gitignore`에 포함 — 배포 시 빌드 필요).

### 라이선스

[MIT](LICENSE)

---

## English

### Overview

Connect paths **outside your vault** into the vault as **symbolic links**, so they appear in the Obsidian file explorer without copying data.

### Features

- **Link directories and files** — external absolute path → relative path inside the vault
- **File explorer context menu** — **Add symlink directory** / **Add symlink file** on folders
- **Manage links** — list, health status, and removal in plugin settings
- **i18n** — Korean and English (auto-detect from Obsidian, or override in settings)

### Requirements

- **Obsidian desktop** only
- **Local filesystem vault**
- macOS / Linux recommended (Windows symlink permissions may vary)

### Installation

```bash
git clone https://github.com/hunchulchoi/lns_directories.git
cd lns_directories
npm install
npm run build
```

Copy `main.js`, `manifest.json`, and `styles.css` to:

```
<Vault>/.obsidian/plugins/lns-directories/
```

Enable **LNS Directories** under **Settings → Community plugins**.

### Usage

1. Right-click a **folder** in the file explorer → **Add symlink directory** or **Add symlink file**
2. Pick the external path with **Browse** or paste an absolute path
3. Confirm the **link path in vault** (defaults to `folder/basename` under the right-clicked folder)
4. Click **Create link**

Also available from the ribbon **link** icon and the command palette.

### Settings

**Settings → LNS Directories** — language and registered links.

Reload the plugin after changing language if you want command palette labels updated.

### Development

```bash
npm run dev
npm run build
```

### License

[MIT](LICENSE)

---

## Author

[hunchulchoi](https://github.com/hunchulchoi)
