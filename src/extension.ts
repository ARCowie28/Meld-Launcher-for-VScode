// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as child_process from 'child_process';

function prompt(mode: number) {		
	// Prompt user for a comparison directory (mode = 1) or file (mode = 2).
	// Returns a promise that should resolve to a uri.
	let opts: vscode.OpenDialogOptions = {};
	if (mode === 1) {
		opts.canSelectFiles = false;
		opts.canSelectFolders = true;
		opts.canSelectMany = false;
		opts.openLabel = 'Select comparison directory';
	}
	else if (mode === 2) {
		opts.canSelectFiles = true;
		opts.canSelectFolders = false;
		opts.canSelectMany = false;
		opts.openLabel = 'Select comparison file';
	}
	return vscode.window.showOpenDialog(opts);
}

function runMeld(leftDir: string, rightDir: string) {
	let args = [leftDir,rightDir];
	let process = child_process.spawn('meld', args);
}

export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('meld.meldroot', () => {

		// Check for current workspace.
    	if (vscode.workspace.workspaceFolders) {
			// Prompt for comparison directory.
			let browse = prompt(1);

			// Now run meld.
			browse.then((result) => {
				let leftURI = result as vscode.Uri[];
				let leftDir = leftURI[0].fsPath;			
				let dirs = vscode.workspace.workspaceFolders as vscode.WorkspaceFolder[];
				let rightDir = dirs[0].uri.fsPath;	
				runMeld(leftDir,rightDir);
			});
		}
		else {
			vscode.window.showWarningMessage('No current workspace.');
		}
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('meld.melddir', (dir: vscode.Uri) => {
		// Prompt for a comparison directory.		
		let browse = prompt(1);

		// Now run meld.
		browse.then((result) => {
			let leftURI = result as vscode.Uri[];
			let leftDir = leftURI[0].fsPath;			
			let rightDir = dir.fsPath;
			runMeld(leftDir,rightDir);
		});
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('meld.meldfile', (file: vscode.Uri) => {
		// Prompt for a comparison file.		
		let browse = prompt(2);

		// Now run meld.
		browse.then((result) => {
			let leftURI = result as vscode.Uri[];
			let leftFile = leftURI[0].fsPath;			
			let rightFile = file.fsPath;
			runMeld(leftFile,rightFile);
		});
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
