import type { MessageKey } from "./en";

export const ko: Record<MessageKey, string> = {
	"ribbon.tooltip": "외부 경로 연결",
	"ribbon.openLinksPanel": "연결 목록 패널",
	"ribbon.linkDirectory": "디렉터리 연결…",
	"ribbon.linkFile": "파일 연결…",

	"cmd.openLinksPanel": "LNS 연결 목록 패널 열기",
	"cmd.linkDirectory": "디렉터리 심볼릭 링크 연결",
	"cmd.linkFile": "파일 심볼릭 링크 연결",
	"cmd.refreshLinks": "연결 상태 새로고침",

	"panel.title": "LNS 연결",
	"panel.refresh": "새로고침",

	"menu.addSymDirectory": "심볼디렉토리 추가",
	"menu.addSymFile": "심볼파일 추가",

	"modal.titleDirectory": "디렉터리 연결",
	"modal.titleFile": "파일 연결",
	"modal.description":
		"외부 경로를 볼트 안의 심볼릭 링크(ln -s)로 만듭니다.",
	"modal.sourceName": "원본 경로",
	"modal.sourceDesc": "연결할 파일 또는 폴더의 절대 경로",
	"modal.sourcePlaceholder": "/Users/me/Documents/notes",
	"modal.browse": "찾아보기",
	"modal.vaultLinkName": "볼트 내 링크 경로",
	"modal.vaultLinkDescDefault":
		"볼트 루트 기준 상대 경로 (예: _links/my-notes)",
	"modal.vaultLinkDescFolder": "우클릭한 폴더 기준: {{folder}}",
	"modal.vaultLinkPlaceholderFolder": "{{folder}}/이름",
	"modal.vaultLinkPlaceholderDefault": "_links/my-notes",
	"modal.create": "연결 만들기",
	"modal.cancel": "취소",

	"dialog.pickDirectory": "연결할 디렉터리 선택",
	"dialog.pickFile": "연결할 파일 선택",

	"settings.description":
		"외부 파일·폴더를 볼트 안에 심볼릭 링크로 연결합니다. macOS/Linux에서는 ln -s와 동일합니다.",
	"settings.newLink": "새 연결",
	"settings.newLinkDesc": "명령 팔레트에서도 추가할 수 있습니다.",
	"settings.linkDirectory": "디렉터리 연결",
	"settings.linkFile": "파일 연결",
	"settings.empty": "등록된 연결이 없습니다.",
	"settings.sourceLabel": "원본: {{path}}",
	"settings.showInFinder": "Finder에서 보기",
	"settings.openNote": "노트로 열기",
	"settings.removeLink": "링크 제거",
	"settings.revealInExplorer": "탐색기에서 보기",
	"settings.showExplorerMarkersName": "파일 탐색기에서 링크 표시",
	"settings.showExplorerMarkersDesc":
		"등록된 심볼릭 링크 경로에 사이드바 파일 트리에서 아이콘과 색을 표시합니다.",
	"settings.openLinksPanelName": "연결 목록 패널",
	"settings.openLinksPanelDesc":
		"등록된 연결만 모아 보는 사이드바 뷰를 엽니다.",
	"settings.openLinksPanel": "연결 목록 패널 열기",
	"settings.localeName": "언어",
	"settings.localeDesc": "플러그인 UI 표시 언어",

	"locale.auto": "자동 (Obsidian 설정 따름)",
	"locale.en": "English",
	"locale.ko": "한국어",

	"health.ok": "정상",
	"health.missing_source": "원본 없음",
	"health.missing_link": "링크 없음",
	"health.broken": "깨짐",

	"kind.directory": "디렉터리",
	"kind.file": "파일",

	"notice.refreshCount": "연결 {{count}}개 확인됨",
	"notice.localVaultOnly": "로컬 파일 시스템 볼트에서만 사용할 수 있습니다.",
	"notice.sourceRequired": "원본 경로를 입력하거나 찾아보기로 선택하세요.",
	"notice.wrongKind":
		"선택한 항목은 {{kind}}입니다. {{expected}} 연결을 선택하세요.",
	"notice.linked": "연결됨: {{path}}",
	"notice.linkFailed": "연결 실패: {{message}}",
	"notice.pathOpenFailed": "경로를 열 수 없습니다.",
	"notice.fileNotInVault":
		"볼트에서 파일을 찾을 수 없습니다. 파일 탐색기를 새로고침해 보세요.",
	"notice.removed": "제거됨: {{path}}",
	"notice.removeFailed": "제거 실패: {{message}}",

	"error.emptyLinkPath": "볼트 내 링크 경로를 입력하세요.",
	"error.pathOutsideVault": "볼트 밖으로 나가는 경로는 허용되지 않습니다.",
	"error.sourceRequired": "원본 경로를 입력하세요.",
	"error.sourceNotFound": "원본 경로가 없습니다: {{path}}",
	"error.invalidSourceKind": "파일 또는 디렉터리만 연결할 수 있습니다.",
	"error.pathExists":
		"이미 존재하는 경로입니다. 다른 이름을 사용하세요: {{path}}",
	"error.notSymlink": "심볼릭 링크가 아닌 항목은 삭제하지 않습니다.",
};
