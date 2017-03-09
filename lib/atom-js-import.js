'use babel';

import AtomJsImportView from './atom-js-import-view';
import { CompositeDisposable } from 'atom';

export default {

  atomJsImportView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomJsImportView = new AtomJsImportView(state.atomJsImportViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomJsImportView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-js-import:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomJsImportView.destroy();
  },

  serialize() {
    return {
      atomJsImportViewState: this.atomJsImportView.serialize()
    };
  },

  toggle() {
    const editor = atom.workspace.getActiveTextEditor();
    const selection = editor.getSelectedText()
    const reversed = selection.split('').reverse().join('')
    const projectPath = atom.project.getPaths()[0];
    const filePath = atom.workspace.getActivePaneItem().buffer.file.path;
    const importPath = filePath
      .replace(projectPath, '')
      .replace('/', '')
      .replace(/.jsx|.js/, '')
    atom.clipboard.write(`import { ${selection} } from '${importPath};'`);
  }

};
