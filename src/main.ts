import './style.css'
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';

const SAVE_KEY = 'editor-data'

let savedData = window.localStorage.getItem(SAVE_KEY);
let editorData:OutputData = {
  blocks: []
};

if(savedData) {
  editorData = JSON.parse(savedData)
}

const editor = new EditorJS({
  holder: 'editor',
  placeholder: 'Let`s write an awesome story!',
  data: editorData,
  tools: {
    Header
  },
  onChange: async () => {
    await editor.isReady;
    editor.save().then((data) => {
      preview.render(data)
    })
  }
});

const preview = new EditorJS({
  holder: 'preview',
  readOnly: true,
  data: editorData,
  tools: {
    Header
  }
});

const saveButton = document.querySelector<HTMLElement>('#btn-save');
let saving = false;
saveButton?.addEventListener('click', async (e) => {
  e.preventDefault();
  if(saving) return;
  saving = true;
  saveButton.setAttribute('disabled', '');
  if(saveButton.dataset.loadingText) {
    saveButton.textContent = saveButton.dataset.loadingText
  }
  try {
    const data = await editor.save()
    window.localStorage.setItem('editor-data', JSON.stringify(data));
    

    // fake http request
    await fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
  }catch(e) {
    console.log(e)
  } finally {
    saving = false;
    saveButton.removeAttribute('disabled');
    if(saveButton.dataset.defaultText) {
      saveButton.textContent = saveButton.dataset.defaultText
    }else{
      saveButton.textContent = 'Save'
    }
  }
})