type HeaderProps = {
    onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="app-header">
            <button
                type="button"
                className="menu-button"
                aria-label="Open navigation"
                onClick={onMenuClick}
            >
                <span />
                <span />
                <span />
            </button>

            <div>
                <p className="header-eyebrow">Workspace</p>
                <h1 className="header-title">Daily Time Record</h1>
            </div>
        </header>
    );
}