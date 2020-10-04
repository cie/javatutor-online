/**
 * Represents sources that can cause [selection change events](#window.onDidChangeTextEditorSelection).
 */
export enum TextEditorSelectionChangeKind {
  /**
   * Selection changed due to typing in the editor.
   */
  Keyboard = 1,
  /**
   * Selection change due to clicking in the editor.
   */
  Mouse = 2,
  /**
   * Selection changed because a command ran.
   */
  Command = 3
}
/**
 * Rendering style of the cursor.
 */
export enum TextEditorCursorStyle {
  /**
   * Render the cursor as a vertical thick line.
   */
  Line = 1,
  /**
   * Render the cursor as a block filled.
   */
  Block = 2,
  /**
   * Render the cursor as a thick horizontal line.
   */
  Underline = 3,
  /**
   * Render the cursor as a vertical thin line.
   */
  LineThin = 4,
  /**
   * Render the cursor as a block outlined.
   */
  BlockOutline = 5,
  /**
   * Render the cursor as a thin horizontal line.
   */
  UnderlineThin = 6
}
/**
 * Rendering style of the line numbers.
 */
export enum TextEditorLineNumbersStyle {
  /**
   * Do not render the line numbers.
   */
  Off = 0,
  /**
   * Render the line numbers.
   */
  On = 1,
  /**
   * Render the line numbers with values relative to the primary cursor location.
   */
  Relative = 2
}
/**
 * Represents different [reveal](#TextEditor.revealRange) strategies in a text editor.
 */
export enum TextEditorRevealType {
  /**
   * The range will be revealed with as little scrolling as possible.
   */
  Default = 0,
  /**
   * The range will always be revealed in the center of the viewport.
   */
  InCenter = 1,
  /**
   * If the range is outside the viewport, it will be revealed in the center of the viewport.
   * Otherwise, it will be revealed with as little scrolling as possible.
   */
  InCenterIfOutsideViewport = 2,
  /**
   * The range will always be revealed at the top of the viewport.
   */
  AtTop = 3
}
/**
 * Represents different positions for rendering a decoration in an [overview ruler](#DecorationRenderOptions.overviewRulerLane).
 * The overview ruler supports three lanes.
 */
export enum OverviewRulerLane {
  Left = 1,
  Center = 2,
  Right = 4,
  Full = 7
}
/**
 * Describes the behavior of decorations when typing/editing at their edges.
 */
export enum DecorationRangeBehavior {
  /**
   * The decoration's range will widen when edits occur at the start or end.
   */
  OpenOpen = 0,
  /**
   * The decoration's range will not widen when edits occur at the start of end.
   */
  ClosedClosed = 1,
  /**
   * The decoration's range will widen when edits occur at the start, but not at the end.
   */
  OpenClosed = 2,
  /**
   * The decoration's range will widen when edits occur at the end, but not at the start.
   */
  ClosedOpen = 3
}
/**
 * Represents an end of line character sequence in a [document](#TextDocument).
 */
export enum EndOfLine {
  /**
   * The line feed `\n` character.
   */
  LF = 1,
  /**
   * The carriage return line feed `\r\n` sequence.
   */
  CRLF = 2
}
/**
 * A document highlight kind.
 */
export enum DocumentHighlightKind {
  /**
   * A textual occurrence.
   */
  Text = 0,

  /**
   * Read-access of a symbol, like reading a variable.
   */
  Read = 1,

  /**
   * Write-access of a symbol, like writing to a variable.
   */
  Write = 2
}
/**
 * A symbol kind.
 */
export enum SymbolKind {
  File = 0,
  Module = 1,
  Namespace = 2,
  Package = 3,
  Class = 4,
  Method = 5,
  Property = 6,
  Field = 7,
  Constructor = 8,
  Enum = 9,
  Interface = 10,
  Function = 11,
  Variable = 12,
  Constant = 13,
  String = 14,
  Number = 15,
  Boolean = 16,
  Array = 17,
  Object = 18,
  Key = 19,
  Null = 20,
  EnumMember = 21,
  Struct = 22,
  Event = 23,
  Operator = 24,
  TypeParameter = 25
}

/**
 * How a [`SignatureHelpProvider`](#SignatureHelpProvider) was triggered.
 */
export enum SignatureHelpTriggerKind {
  /**
   * Signature help was invoked manually by the user or by a command.
   */
  Invoke = 1,

  /**
   * Signature help was triggered by a trigger character.
   */
  TriggerCharacter = 2,

  /**
   * Signature help was triggered by the cursor moving or by the document content changing.
   */
  ContentChange = 3
}
/**
 * Completion item kinds.
 */
export enum CompletionItemKind {
  Text = 0,
  Method = 1,
  Function = 2,
  Constructor = 3,
  Field = 4,
  Variable = 5,
  Class = 6,
  Interface = 7,
  Module = 8,
  Property = 9,
  Unit = 10,
  Value = 11,
  Enum = 12,
  Keyword = 13,
  Snippet = 14,
  Color = 15,
  Reference = 17,
  File = 16,
  Folder = 18,
  EnumMember = 19,
  Constant = 20,
  Struct = 21,
  Event = 22,
  Operator = 23,
  TypeParameter = 24
}

/**
 * How a [completion provider](#CompletionItemProvider) was triggered
 */
export enum CompletionTriggerKind {
  /**
   * Completion was triggered normally.
   */
  Invoke = 0,
  /**
   * Completion was triggered by a trigger character.
   */
  TriggerCharacter = 1,
  /**
   * Completion was re-triggered as current completion list is incomplete
   */
  TriggerForIncompleteCompletions = 2
}
/**
 * An enumeration of specific folding range kinds. The kind is an optional field of a [FoldingRange](#FoldingRange)
 * and is used to distinguish specific folding ranges such as ranges originated from comments. The kind is used by commands like
 * `Fold all comments` or `Fold all regions`.
 * If the kind is not set on the range, the range originated from a syntax element other than comments, imports or region markers.
 */
export enum FoldingRangeKind {
  /**
   * Kind for folding range representing a comment.
   */
  Comment = 1,
  /**
   * Kind for folding range representing a import.
   */
  Imports = 2,
  /**
   * Kind for folding range representing regions originating from folding markers like `#region` and `#endregion`.
   */
  Region = 3
}
/**
 * Describes what to do with the indentation when pressing Enter.
 */
export enum IndentAction {
  /**
   * Insert new line and copy the previous line's indentation.
   */
  None = 0,
  /**
   * Insert new line and indent once (relative to the previous line's indentation).
   */
  Indent = 1,
  /**
   * Insert two new lines:
   *  - the first one indented which will hold the cursor
   *  - the second one at the same indentation level
   */
  IndentOutdent = 2,
  /**
   * Insert new line and outdent once (relative to the previous line's indentation).
   */
  Outdent = 3
}
/**
 * The configuration target
 */
export enum ConfigurationTarget {
  /**
   * Global configuration
   */
  Global = 1,

  /**
   * Workspace configuration
   */
  Workspace = 2,

  /**
   * Workspace folder configuration
   */
  WorkspaceFolder = 3
}
/**
 * Represents the severity of diagnostics.
 */
export enum DiagnosticSeverity {
  /**
   * Something not allowed by the rules of a language or other means.
   */
  Error = 0,

  /**
   * Something suspicious but allowed.
   */
  Warning = 1,

  /**
   * Something to inform about but not a problem.
   */
  Information = 2,

  /**
   * Something to hint to a better way of doing it, like proposing
   * a refactoring.
   */
  Hint = 3
}
/**
 * Additional metadata about the type of a diagnostic.
 */
export enum DiagnosticTag {
  /**
   * Unused or unnecessary code.
   *
   * Diagnostics with this tag are rendered faded out. The amount of fading
   * is controlled by the `"editorUnnecessaryCode.opacity"` theme color. For
   * example, `"editorUnnecessaryCode.opacity": "#000000c0"` will render the
   * code with 75% opacity. For high contrast themes, use the
   * `"editorUnnecessaryCode.border"` theme color to underline unnecessary code
   * instead of fading it out.
   */
  Unnecessary = 1
}
/**
 * Denotes a location of an editor in the window. Editors can be arranged in a grid
 * and each column represents one editor location in that grid by counting the editors
 * in order of their appearance.
 */
export enum ViewColumn {
  /**
   * A *symbolic* editor column representing the currently active column. This value
   * can be used when opening editors, but the *resolved* [viewColumn](#TextEditor.viewColumn)-value
   * of editors will always be `One`, `Two`, `Three`,... or `undefined` but never `Active`.
   */
  Active = -1,
  /**
   * A *symbolic* editor column representing the column to the side of the active one. This value
   * can be used when opening editors, but the *resolved* [viewColumn](#TextEditor.viewColumn)-value
   * of editors will always be `One`, `Two`, `Three`,... or `undefined` but never `Beside`.
   */
  Beside = -2,
  /**
   * The first editor column.
   */
  One = 1,
  /**
   * The second editor column.
   */
  Two = 2,
  /**
   * The third editor column.
   */
  Three = 3,
  /**
   * The fourth editor column.
   */
  Four = 4,
  /**
   * The fifth editor column.
   */
  Five = 5,
  /**
   * The sixth editor column.
   */
  Six = 6,
  /**
   * The seventh editor column.
   */
  Seven = 7,
  /**
   * The eighth editor column.
   */
  Eight = 8,
  /**
   * The ninth editor column.
   */
  Nine = 9
}
/**
 * Represents the alignment of status bar items.
 */
export enum StatusBarAlignment {
  /**
   * Aligned to the left side.
   */
  Left = 1,

  /**
   * Aligned to the right side.
   */
  Right = 2
}
/**
 * Controls the behaviour of the terminal's visibility.
 */
export enum TaskRevealKind {
  /**
   * Always brings the terminal to front if the task is executed.
   */
  Always = 1,

  /**
   * Only brings the terminal to front if a problem is detected executing the task
   * (e.g. the task couldn't be started because).
   */
  Silent = 2,

  /**
   * The terminal never comes to front when the task is executed.
   */
  Never = 3
}
/**
 * Controls how the task channel is used between tasks
 */
export enum TaskPanelKind {
  /**
   * Shares a panel with other tasks. This is the default.
   */
  Shared = 1,

  /**
   * Uses a dedicated panel for this tasks. The panel is not
   * shared with other tasks.
   */
  Dedicated = 2,

  /**
   * Creates a new panel whenever this task is executed.
   */
  New = 3
}
/**
 * Defines how an argument should be quoted if it contains
 * spaces or unsupported characters.
 */
export enum ShellQuoting {
  /**
   * Character escaping should be used. This for example
   * uses \ on bash and ` on PowerShell.
   */
  Escape = 1,

  /**
   * Strong string quoting should be used. This for example
   * uses " for Windows cmd and ' for bash and PowerShell.
   * Strong quoting treats arguments as literal strings.
   * Under PowerShell echo 'The value is $(2 * 3)' will
   * print `The value is $(2 * 3)`
   */
  Strong = 2,

  /**
   * Weak string quoting should be used. This for example
   * uses " for Windows cmd, bash and PowerShell. Weak quoting
   * still performs some kind of evaluation inside the quoted
   * string.  Under PowerShell echo "The value is $(2 * 3)"
   * will print `The value is 6`
   */
  Weak = 3
}
/**
 * The scope of a task.
 */
export enum TaskScope {
  /**
   * The task is a global task
   */
  Global = 1,

  /**
   * The task is a workspace task
   */
  Workspace = 2
}
/**
 * Enumeration of file types. The types `File` and `Directory` can also be
 * a symbolic links, in that use `FileType.File | FileType.SymbolicLink` and
 * `FileType.Directory | FileType.SymbolicLink`.
 */
export enum FileType {
  /**
   * The file type is unknown.
   */
  Unknown = 0,
  /**
   * A regular file.
   */
  File = 1,
  /**
   * A directory.
   */
  Directory = 2,
  /**
   * A symbolic link to a file.
   */
  SymbolicLink = 64
}
/**
 * Enumeration of file change types.
 */
export enum FileChangeType {
  /**
   * The contents or metadata of a file have changed.
   */
  Changed = 1,

  /**
   * A file has been created.
   */
  Created = 2,

  /**
   * A file has been deleted.
   */
  Deleted = 3
}
/**
 * Collapsible state of the tree item
 */
export enum TreeItemCollapsibleState {
  /**
   * Determines an item can be neither collapsed nor expanded. Implies it has no children.
   */
  None = 0,
  /**
   * Determines an item is collapsed
   */
  Collapsed = 1,
  /**
   * Determines an item is expanded
   */
  Expanded = 2
}
/**
 * A location in the editor at which progress information can be shown. It depends on the
 * location how progress is visually represented.
 */
export enum ProgressLocation {
  /**
   * Show progress for the source control viewlet, as overlay for the icon and as progress bar
   * inside the viewlet (when visible). Neither supports cancellation nor discrete progress.
   */
  SourceControl = 1,

  /**
   * Show progress in the status bar of the editor. Neither supports cancellation nor discrete progress.
   */
  Window = 10,

  /**
   * Show progress as notification with an optional cancel button. Supports to show infinite and discrete progress.
   */
  Notification = 15
}
/**
 * Represents reasons why a text document is saved.
 */
export enum TextDocumentSaveReason {
  /**
   * Manually triggered, e.g. by the user pressing save, by starting debugging,
   * or by an API call.
   */
  Manual = 1,

  /**
   * Automatic after a delay.
   */
  AfterDelay = 2,

  /**
   * When the editor lost focus.
   */
  FocusOut = 3
}
