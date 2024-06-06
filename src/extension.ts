import * as vscode from 'vscode';
import { window, commands, ExtensionContext } from 'vscode';

async function openInUntitled(content: string, language?: string) {
    const document = await vscode.workspace.openTextDocument({
        language,
        content,
    });
    vscode.window.showTextDocument(document);
}

export function activate(context: ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('frequency.count_lines', async () => {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active text editor found!');
			return;
		}

		let doc = editor.document;
		let text = doc.getText();

		let lines = text.split('\n').filter(line => line.trim() !== ''); // exclude empty lines

		let frequencyMap: { [key: string]: number } = {};

		lines.forEach(line => {
			line = line.trim();  // trim out the newline character and whitespace
			if (frequencyMap[line]) {
				frequencyMap[line]++;
			} else {
				frequencyMap[line] = 1;
			}
		});

		// convert to array and sort by frequency
		let frequencyArray = Object.entries(frequencyMap).sort((a, b) => b[1] - a[1]);

		let result = '';
		frequencyArray.forEach(item => {
			result += `${item[1]}\t${item[0]}\n`;
		});

		openInUntitled(result);
	}));
}

// This method is called when the extension is deactivated
export function deactivate() {}
