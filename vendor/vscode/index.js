"use strict";
exports.__esModule = true;
exports.TextDocumentSaveReason = exports.ProgressLocation = exports.TreeItemCollapsibleState = exports.FileChangeType = exports.FileType = exports.TaskScope = exports.ShellQuoting = exports.TaskPanelKind = exports.TaskRevealKind = exports.StatusBarAlignment = exports.ViewColumn = exports.DiagnosticTag = exports.DiagnosticSeverity = exports.ConfigurationTarget = exports.IndentAction = exports.FoldingRangeKind = exports.CompletionTriggerKind = exports.CompletionItemKind = exports.SignatureHelpTriggerKind = exports.SymbolKind = exports.DocumentHighlightKind = exports.EndOfLine = exports.DecorationRangeBehavior = exports.OverviewRulerLane = exports.TextEditorRevealType = exports.TextEditorLineNumbersStyle = exports.TextEditorCursorStyle = exports.TextEditorSelectionChangeKind = void 0;
/**
 * Represents sources that can cause [selection change events](#window.onDidChangeTextEditorSelection).
 */
var TextEditorSelectionChangeKind;
(function (TextEditorSelectionChangeKind) {
    /**
     * Selection changed due to typing in the editor.
     */
    TextEditorSelectionChangeKind[TextEditorSelectionChangeKind["Keyboard"] = 1] = "Keyboard";
    /**
     * Selection change due to clicking in the editor.
     */
    TextEditorSelectionChangeKind[TextEditorSelectionChangeKind["Mouse"] = 2] = "Mouse";
    /**
     * Selection changed because a command ran.
     */
    TextEditorSelectionChangeKind[TextEditorSelectionChangeKind["Command"] = 3] = "Command";
})(TextEditorSelectionChangeKind = exports.TextEditorSelectionChangeKind || (exports.TextEditorSelectionChangeKind = {}));
/**
 * Rendering style of the cursor.
 */
var TextEditorCursorStyle;
(function (TextEditorCursorStyle) {
    /**
     * Render the cursor as a vertical thick line.
     */
    TextEditorCursorStyle[TextEditorCursorStyle["Line"] = 1] = "Line";
    /**
     * Render the cursor as a block filled.
     */
    TextEditorCursorStyle[TextEditorCursorStyle["Block"] = 2] = "Block";
    /**
     * Render the cursor as a thick horizontal line.
     */
    TextEditorCursorStyle[TextEditorCursorStyle["Underline"] = 3] = "Underline";
    /**
     * Render the cursor as a vertical thin line.
     */
    TextEditorCursorStyle[TextEditorCursorStyle["LineThin"] = 4] = "LineThin";
    /**
     * Render the cursor as a block outlined.
     */
    TextEditorCursorStyle[TextEditorCursorStyle["BlockOutline"] = 5] = "BlockOutline";
    /**
     * Render the cursor as a thin horizontal line.
     */
    TextEditorCursorStyle[TextEditorCursorStyle["UnderlineThin"] = 6] = "UnderlineThin";
})(TextEditorCursorStyle = exports.TextEditorCursorStyle || (exports.TextEditorCursorStyle = {}));
/**
 * Rendering style of the line numbers.
 */
var TextEditorLineNumbersStyle;
(function (TextEditorLineNumbersStyle) {
    /**
     * Do not render the line numbers.
     */
    TextEditorLineNumbersStyle[TextEditorLineNumbersStyle["Off"] = 0] = "Off";
    /**
     * Render the line numbers.
     */
    TextEditorLineNumbersStyle[TextEditorLineNumbersStyle["On"] = 1] = "On";
    /**
     * Render the line numbers with values relative to the primary cursor location.
     */
    TextEditorLineNumbersStyle[TextEditorLineNumbersStyle["Relative"] = 2] = "Relative";
})(TextEditorLineNumbersStyle = exports.TextEditorLineNumbersStyle || (exports.TextEditorLineNumbersStyle = {}));
/**
 * Represents different [reveal](#TextEditor.revealRange) strategies in a text editor.
 */
var TextEditorRevealType;
(function (TextEditorRevealType) {
    /**
     * The range will be revealed with as little scrolling as possible.
     */
    TextEditorRevealType[TextEditorRevealType["Default"] = 0] = "Default";
    /**
     * The range will always be revealed in the center of the viewport.
     */
    TextEditorRevealType[TextEditorRevealType["InCenter"] = 1] = "InCenter";
    /**
     * If the range is outside the viewport, it will be revealed in the center of the viewport.
     * Otherwise, it will be revealed with as little scrolling as possible.
     */
    TextEditorRevealType[TextEditorRevealType["InCenterIfOutsideViewport"] = 2] = "InCenterIfOutsideViewport";
    /**
     * The range will always be revealed at the top of the viewport.
     */
    TextEditorRevealType[TextEditorRevealType["AtTop"] = 3] = "AtTop";
})(TextEditorRevealType = exports.TextEditorRevealType || (exports.TextEditorRevealType = {}));
/**
 * Represents different positions for rendering a decoration in an [overview ruler](#DecorationRenderOptions.overviewRulerLane).
 * The overview ruler supports three lanes.
 */
var OverviewRulerLane;
(function (OverviewRulerLane) {
    OverviewRulerLane[OverviewRulerLane["Left"] = 1] = "Left";
    OverviewRulerLane[OverviewRulerLane["Center"] = 2] = "Center";
    OverviewRulerLane[OverviewRulerLane["Right"] = 4] = "Right";
    OverviewRulerLane[OverviewRulerLane["Full"] = 7] = "Full";
})(OverviewRulerLane = exports.OverviewRulerLane || (exports.OverviewRulerLane = {}));
/**
 * Describes the behavior of decorations when typing/editing at their edges.
 */
var DecorationRangeBehavior;
(function (DecorationRangeBehavior) {
    /**
     * The decoration's range will widen when edits occur at the start or end.
     */
    DecorationRangeBehavior[DecorationRangeBehavior["OpenOpen"] = 0] = "OpenOpen";
    /**
     * The decoration's range will not widen when edits occur at the start of end.
     */
    DecorationRangeBehavior[DecorationRangeBehavior["ClosedClosed"] = 1] = "ClosedClosed";
    /**
     * The decoration's range will widen when edits occur at the start, but not at the end.
     */
    DecorationRangeBehavior[DecorationRangeBehavior["OpenClosed"] = 2] = "OpenClosed";
    /**
     * The decoration's range will widen when edits occur at the end, but not at the start.
     */
    DecorationRangeBehavior[DecorationRangeBehavior["ClosedOpen"] = 3] = "ClosedOpen";
})(DecorationRangeBehavior = exports.DecorationRangeBehavior || (exports.DecorationRangeBehavior = {}));
/**
 * Represents an end of line character sequence in a [document](#TextDocument).
 */
var EndOfLine;
(function (EndOfLine) {
    /**
     * The line feed `\n` character.
     */
    EndOfLine[EndOfLine["LF"] = 1] = "LF";
    /**
     * The carriage return line feed `\r\n` sequence.
     */
    EndOfLine[EndOfLine["CRLF"] = 2] = "CRLF";
})(EndOfLine = exports.EndOfLine || (exports.EndOfLine = {}));
/**
 * A document highlight kind.
 */
var DocumentHighlightKind;
(function (DocumentHighlightKind) {
    /**
     * A textual occurrence.
     */
    DocumentHighlightKind[DocumentHighlightKind["Text"] = 0] = "Text";
    /**
     * Read-access of a symbol, like reading a variable.
     */
    DocumentHighlightKind[DocumentHighlightKind["Read"] = 1] = "Read";
    /**
     * Write-access of a symbol, like writing to a variable.
     */
    DocumentHighlightKind[DocumentHighlightKind["Write"] = 2] = "Write";
})(DocumentHighlightKind = exports.DocumentHighlightKind || (exports.DocumentHighlightKind = {}));
/**
 * A symbol kind.
 */
var SymbolKind;
(function (SymbolKind) {
    SymbolKind[SymbolKind["File"] = 0] = "File";
    SymbolKind[SymbolKind["Module"] = 1] = "Module";
    SymbolKind[SymbolKind["Namespace"] = 2] = "Namespace";
    SymbolKind[SymbolKind["Package"] = 3] = "Package";
    SymbolKind[SymbolKind["Class"] = 4] = "Class";
    SymbolKind[SymbolKind["Method"] = 5] = "Method";
    SymbolKind[SymbolKind["Property"] = 6] = "Property";
    SymbolKind[SymbolKind["Field"] = 7] = "Field";
    SymbolKind[SymbolKind["Constructor"] = 8] = "Constructor";
    SymbolKind[SymbolKind["Enum"] = 9] = "Enum";
    SymbolKind[SymbolKind["Interface"] = 10] = "Interface";
    SymbolKind[SymbolKind["Function"] = 11] = "Function";
    SymbolKind[SymbolKind["Variable"] = 12] = "Variable";
    SymbolKind[SymbolKind["Constant"] = 13] = "Constant";
    SymbolKind[SymbolKind["String"] = 14] = "String";
    SymbolKind[SymbolKind["Number"] = 15] = "Number";
    SymbolKind[SymbolKind["Boolean"] = 16] = "Boolean";
    SymbolKind[SymbolKind["Array"] = 17] = "Array";
    SymbolKind[SymbolKind["Object"] = 18] = "Object";
    SymbolKind[SymbolKind["Key"] = 19] = "Key";
    SymbolKind[SymbolKind["Null"] = 20] = "Null";
    SymbolKind[SymbolKind["EnumMember"] = 21] = "EnumMember";
    SymbolKind[SymbolKind["Struct"] = 22] = "Struct";
    SymbolKind[SymbolKind["Event"] = 23] = "Event";
    SymbolKind[SymbolKind["Operator"] = 24] = "Operator";
    SymbolKind[SymbolKind["TypeParameter"] = 25] = "TypeParameter";
})(SymbolKind = exports.SymbolKind || (exports.SymbolKind = {}));
/**
 * How a [`SignatureHelpProvider`](#SignatureHelpProvider) was triggered.
 */
var SignatureHelpTriggerKind;
(function (SignatureHelpTriggerKind) {
    /**
     * Signature help was invoked manually by the user or by a command.
     */
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["Invoke"] = 1] = "Invoke";
    /**
     * Signature help was triggered by a trigger character.
     */
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["TriggerCharacter"] = 2] = "TriggerCharacter";
    /**
     * Signature help was triggered by the cursor moving or by the document content changing.
     */
    SignatureHelpTriggerKind[SignatureHelpTriggerKind["ContentChange"] = 3] = "ContentChange";
})(SignatureHelpTriggerKind = exports.SignatureHelpTriggerKind || (exports.SignatureHelpTriggerKind = {}));
/**
 * Completion item kinds.
 */
var CompletionItemKind;
(function (CompletionItemKind) {
    CompletionItemKind[CompletionItemKind["Text"] = 0] = "Text";
    CompletionItemKind[CompletionItemKind["Method"] = 1] = "Method";
    CompletionItemKind[CompletionItemKind["Function"] = 2] = "Function";
    CompletionItemKind[CompletionItemKind["Constructor"] = 3] = "Constructor";
    CompletionItemKind[CompletionItemKind["Field"] = 4] = "Field";
    CompletionItemKind[CompletionItemKind["Variable"] = 5] = "Variable";
    CompletionItemKind[CompletionItemKind["Class"] = 6] = "Class";
    CompletionItemKind[CompletionItemKind["Interface"] = 7] = "Interface";
    CompletionItemKind[CompletionItemKind["Module"] = 8] = "Module";
    CompletionItemKind[CompletionItemKind["Property"] = 9] = "Property";
    CompletionItemKind[CompletionItemKind["Unit"] = 10] = "Unit";
    CompletionItemKind[CompletionItemKind["Value"] = 11] = "Value";
    CompletionItemKind[CompletionItemKind["Enum"] = 12] = "Enum";
    CompletionItemKind[CompletionItemKind["Keyword"] = 13] = "Keyword";
    CompletionItemKind[CompletionItemKind["Snippet"] = 14] = "Snippet";
    CompletionItemKind[CompletionItemKind["Color"] = 15] = "Color";
    CompletionItemKind[CompletionItemKind["Reference"] = 17] = "Reference";
    CompletionItemKind[CompletionItemKind["File"] = 16] = "File";
    CompletionItemKind[CompletionItemKind["Folder"] = 18] = "Folder";
    CompletionItemKind[CompletionItemKind["EnumMember"] = 19] = "EnumMember";
    CompletionItemKind[CompletionItemKind["Constant"] = 20] = "Constant";
    CompletionItemKind[CompletionItemKind["Struct"] = 21] = "Struct";
    CompletionItemKind[CompletionItemKind["Event"] = 22] = "Event";
    CompletionItemKind[CompletionItemKind["Operator"] = 23] = "Operator";
    CompletionItemKind[CompletionItemKind["TypeParameter"] = 24] = "TypeParameter";
})(CompletionItemKind = exports.CompletionItemKind || (exports.CompletionItemKind = {}));
/**
 * How a [completion provider](#CompletionItemProvider) was triggered
 */
var CompletionTriggerKind;
(function (CompletionTriggerKind) {
    /**
     * Completion was triggered normally.
     */
    CompletionTriggerKind[CompletionTriggerKind["Invoke"] = 0] = "Invoke";
    /**
     * Completion was triggered by a trigger character.
     */
    CompletionTriggerKind[CompletionTriggerKind["TriggerCharacter"] = 1] = "TriggerCharacter";
    /**
     * Completion was re-triggered as current completion list is incomplete
     */
    CompletionTriggerKind[CompletionTriggerKind["TriggerForIncompleteCompletions"] = 2] = "TriggerForIncompleteCompletions";
})(CompletionTriggerKind = exports.CompletionTriggerKind || (exports.CompletionTriggerKind = {}));
/**
 * An enumeration of specific folding range kinds. The kind is an optional field of a [FoldingRange](#FoldingRange)
 * and is used to distinguish specific folding ranges such as ranges originated from comments. The kind is used by commands like
 * `Fold all comments` or `Fold all regions`.
 * If the kind is not set on the range, the range originated from a syntax element other than comments, imports or region markers.
 */
var FoldingRangeKind;
(function (FoldingRangeKind) {
    /**
     * Kind for folding range representing a comment.
     */
    FoldingRangeKind[FoldingRangeKind["Comment"] = 1] = "Comment";
    /**
     * Kind for folding range representing a import.
     */
    FoldingRangeKind[FoldingRangeKind["Imports"] = 2] = "Imports";
    /**
     * Kind for folding range representing regions originating from folding markers like `#region` and `#endregion`.
     */
    FoldingRangeKind[FoldingRangeKind["Region"] = 3] = "Region";
})(FoldingRangeKind = exports.FoldingRangeKind || (exports.FoldingRangeKind = {}));
/**
 * Describes what to do with the indentation when pressing Enter.
 */
var IndentAction;
(function (IndentAction) {
    /**
     * Insert new line and copy the previous line's indentation.
     */
    IndentAction[IndentAction["None"] = 0] = "None";
    /**
     * Insert new line and indent once (relative to the previous line's indentation).
     */
    IndentAction[IndentAction["Indent"] = 1] = "Indent";
    /**
     * Insert two new lines:
     *  - the first one indented which will hold the cursor
     *  - the second one at the same indentation level
     */
    IndentAction[IndentAction["IndentOutdent"] = 2] = "IndentOutdent";
    /**
     * Insert new line and outdent once (relative to the previous line's indentation).
     */
    IndentAction[IndentAction["Outdent"] = 3] = "Outdent";
})(IndentAction = exports.IndentAction || (exports.IndentAction = {}));
/**
 * The configuration target
 */
var ConfigurationTarget;
(function (ConfigurationTarget) {
    /**
     * Global configuration
     */
    ConfigurationTarget[ConfigurationTarget["Global"] = 1] = "Global";
    /**
     * Workspace configuration
     */
    ConfigurationTarget[ConfigurationTarget["Workspace"] = 2] = "Workspace";
    /**
     * Workspace folder configuration
     */
    ConfigurationTarget[ConfigurationTarget["WorkspaceFolder"] = 3] = "WorkspaceFolder";
})(ConfigurationTarget = exports.ConfigurationTarget || (exports.ConfigurationTarget = {}));
/**
 * Represents the severity of diagnostics.
 */
var DiagnosticSeverity;
(function (DiagnosticSeverity) {
    /**
     * Something not allowed by the rules of a language or other means.
     */
    DiagnosticSeverity[DiagnosticSeverity["Error"] = 0] = "Error";
    /**
     * Something suspicious but allowed.
     */
    DiagnosticSeverity[DiagnosticSeverity["Warning"] = 1] = "Warning";
    /**
     * Something to inform about but not a problem.
     */
    DiagnosticSeverity[DiagnosticSeverity["Information"] = 2] = "Information";
    /**
     * Something to hint to a better way of doing it, like proposing
     * a refactoring.
     */
    DiagnosticSeverity[DiagnosticSeverity["Hint"] = 3] = "Hint";
})(DiagnosticSeverity = exports.DiagnosticSeverity || (exports.DiagnosticSeverity = {}));
/**
 * Additional metadata about the type of a diagnostic.
 */
var DiagnosticTag;
(function (DiagnosticTag) {
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
    DiagnosticTag[DiagnosticTag["Unnecessary"] = 1] = "Unnecessary";
})(DiagnosticTag = exports.DiagnosticTag || (exports.DiagnosticTag = {}));
/**
 * Denotes a location of an editor in the window. Editors can be arranged in a grid
 * and each column represents one editor location in that grid by counting the editors
 * in order of their appearance.
 */
var ViewColumn;
(function (ViewColumn) {
    /**
     * A *symbolic* editor column representing the currently active column. This value
     * can be used when opening editors, but the *resolved* [viewColumn](#TextEditor.viewColumn)-value
     * of editors will always be `One`, `Two`, `Three`,... or `undefined` but never `Active`.
     */
    ViewColumn[ViewColumn["Active"] = -1] = "Active";
    /**
     * A *symbolic* editor column representing the column to the side of the active one. This value
     * can be used when opening editors, but the *resolved* [viewColumn](#TextEditor.viewColumn)-value
     * of editors will always be `One`, `Two`, `Three`,... or `undefined` but never `Beside`.
     */
    ViewColumn[ViewColumn["Beside"] = -2] = "Beside";
    /**
     * The first editor column.
     */
    ViewColumn[ViewColumn["One"] = 1] = "One";
    /**
     * The second editor column.
     */
    ViewColumn[ViewColumn["Two"] = 2] = "Two";
    /**
     * The third editor column.
     */
    ViewColumn[ViewColumn["Three"] = 3] = "Three";
    /**
     * The fourth editor column.
     */
    ViewColumn[ViewColumn["Four"] = 4] = "Four";
    /**
     * The fifth editor column.
     */
    ViewColumn[ViewColumn["Five"] = 5] = "Five";
    /**
     * The sixth editor column.
     */
    ViewColumn[ViewColumn["Six"] = 6] = "Six";
    /**
     * The seventh editor column.
     */
    ViewColumn[ViewColumn["Seven"] = 7] = "Seven";
    /**
     * The eighth editor column.
     */
    ViewColumn[ViewColumn["Eight"] = 8] = "Eight";
    /**
     * The ninth editor column.
     */
    ViewColumn[ViewColumn["Nine"] = 9] = "Nine";
})(ViewColumn = exports.ViewColumn || (exports.ViewColumn = {}));
/**
 * Represents the alignment of status bar items.
 */
var StatusBarAlignment;
(function (StatusBarAlignment) {
    /**
     * Aligned to the left side.
     */
    StatusBarAlignment[StatusBarAlignment["Left"] = 1] = "Left";
    /**
     * Aligned to the right side.
     */
    StatusBarAlignment[StatusBarAlignment["Right"] = 2] = "Right";
})(StatusBarAlignment = exports.StatusBarAlignment || (exports.StatusBarAlignment = {}));
/**
 * Controls the behaviour of the terminal's visibility.
 */
var TaskRevealKind;
(function (TaskRevealKind) {
    /**
     * Always brings the terminal to front if the task is executed.
     */
    TaskRevealKind[TaskRevealKind["Always"] = 1] = "Always";
    /**
     * Only brings the terminal to front if a problem is detected executing the task
     * (e.g. the task couldn't be started because).
     */
    TaskRevealKind[TaskRevealKind["Silent"] = 2] = "Silent";
    /**
     * The terminal never comes to front when the task is executed.
     */
    TaskRevealKind[TaskRevealKind["Never"] = 3] = "Never";
})(TaskRevealKind = exports.TaskRevealKind || (exports.TaskRevealKind = {}));
/**
 * Controls how the task channel is used between tasks
 */
var TaskPanelKind;
(function (TaskPanelKind) {
    /**
     * Shares a panel with other tasks. This is the default.
     */
    TaskPanelKind[TaskPanelKind["Shared"] = 1] = "Shared";
    /**
     * Uses a dedicated panel for this tasks. The panel is not
     * shared with other tasks.
     */
    TaskPanelKind[TaskPanelKind["Dedicated"] = 2] = "Dedicated";
    /**
     * Creates a new panel whenever this task is executed.
     */
    TaskPanelKind[TaskPanelKind["New"] = 3] = "New";
})(TaskPanelKind = exports.TaskPanelKind || (exports.TaskPanelKind = {}));
/**
 * Defines how an argument should be quoted if it contains
 * spaces or unsupported characters.
 */
var ShellQuoting;
(function (ShellQuoting) {
    /**
     * Character escaping should be used. This for example
     * uses \ on bash and ` on PowerShell.
     */
    ShellQuoting[ShellQuoting["Escape"] = 1] = "Escape";
    /**
     * Strong string quoting should be used. This for example
     * uses " for Windows cmd and ' for bash and PowerShell.
     * Strong quoting treats arguments as literal strings.
     * Under PowerShell echo 'The value is $(2 * 3)' will
     * print `The value is $(2 * 3)`
     */
    ShellQuoting[ShellQuoting["Strong"] = 2] = "Strong";
    /**
     * Weak string quoting should be used. This for example
     * uses " for Windows cmd, bash and PowerShell. Weak quoting
     * still performs some kind of evaluation inside the quoted
     * string.  Under PowerShell echo "The value is $(2 * 3)"
     * will print `The value is 6`
     */
    ShellQuoting[ShellQuoting["Weak"] = 3] = "Weak";
})(ShellQuoting = exports.ShellQuoting || (exports.ShellQuoting = {}));
/**
 * The scope of a task.
 */
var TaskScope;
(function (TaskScope) {
    /**
     * The task is a global task
     */
    TaskScope[TaskScope["Global"] = 1] = "Global";
    /**
     * The task is a workspace task
     */
    TaskScope[TaskScope["Workspace"] = 2] = "Workspace";
})(TaskScope = exports.TaskScope || (exports.TaskScope = {}));
/**
 * Enumeration of file types. The types `File` and `Directory` can also be
 * a symbolic links, in that use `FileType.File | FileType.SymbolicLink` and
 * `FileType.Directory | FileType.SymbolicLink`.
 */
var FileType;
(function (FileType) {
    /**
     * The file type is unknown.
     */
    FileType[FileType["Unknown"] = 0] = "Unknown";
    /**
     * A regular file.
     */
    FileType[FileType["File"] = 1] = "File";
    /**
     * A directory.
     */
    FileType[FileType["Directory"] = 2] = "Directory";
    /**
     * A symbolic link to a file.
     */
    FileType[FileType["SymbolicLink"] = 64] = "SymbolicLink";
})(FileType = exports.FileType || (exports.FileType = {}));
/**
 * Enumeration of file change types.
 */
var FileChangeType;
(function (FileChangeType) {
    /**
     * The contents or metadata of a file have changed.
     */
    FileChangeType[FileChangeType["Changed"] = 1] = "Changed";
    /**
     * A file has been created.
     */
    FileChangeType[FileChangeType["Created"] = 2] = "Created";
    /**
     * A file has been deleted.
     */
    FileChangeType[FileChangeType["Deleted"] = 3] = "Deleted";
})(FileChangeType = exports.FileChangeType || (exports.FileChangeType = {}));
/**
 * Collapsible state of the tree item
 */
var TreeItemCollapsibleState;
(function (TreeItemCollapsibleState) {
    /**
     * Determines an item can be neither collapsed nor expanded. Implies it has no children.
     */
    TreeItemCollapsibleState[TreeItemCollapsibleState["None"] = 0] = "None";
    /**
     * Determines an item is collapsed
     */
    TreeItemCollapsibleState[TreeItemCollapsibleState["Collapsed"] = 1] = "Collapsed";
    /**
     * Determines an item is expanded
     */
    TreeItemCollapsibleState[TreeItemCollapsibleState["Expanded"] = 2] = "Expanded";
})(TreeItemCollapsibleState = exports.TreeItemCollapsibleState || (exports.TreeItemCollapsibleState = {}));
/**
 * A location in the editor at which progress information can be shown. It depends on the
 * location how progress is visually represented.
 */
var ProgressLocation;
(function (ProgressLocation) {
    /**
     * Show progress for the source control viewlet, as overlay for the icon and as progress bar
     * inside the viewlet (when visible). Neither supports cancellation nor discrete progress.
     */
    ProgressLocation[ProgressLocation["SourceControl"] = 1] = "SourceControl";
    /**
     * Show progress in the status bar of the editor. Neither supports cancellation nor discrete progress.
     */
    ProgressLocation[ProgressLocation["Window"] = 10] = "Window";
    /**
     * Show progress as notification with an optional cancel button. Supports to show infinite and discrete progress.
     */
    ProgressLocation[ProgressLocation["Notification"] = 15] = "Notification";
})(ProgressLocation = exports.ProgressLocation || (exports.ProgressLocation = {}));
/**
 * Represents reasons why a text document is saved.
 */
var TextDocumentSaveReason;
(function (TextDocumentSaveReason) {
    /**
     * Manually triggered, e.g. by the user pressing save, by starting debugging,
     * or by an API call.
     */
    TextDocumentSaveReason[TextDocumentSaveReason["Manual"] = 1] = "Manual";
    /**
     * Automatic after a delay.
     */
    TextDocumentSaveReason[TextDocumentSaveReason["AfterDelay"] = 2] = "AfterDelay";
    /**
     * When the editor lost focus.
     */
    TextDocumentSaveReason[TextDocumentSaveReason["FocusOut"] = 3] = "FocusOut";
})(TextDocumentSaveReason = exports.TextDocumentSaveReason || (exports.TextDocumentSaveReason = {}));
