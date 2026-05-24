import os, re, shutil

SB = "https://dovdqmzyfgmkxvqdaeyr.supabase.co"
SK = "sb_publishable_qYWGLAhOR63fEdh3qQcgXg_q57DQnUq"
TAG = '<script src="config.js"></script>'

files = [f for f in os.listdir('.') if f.endswith('.html')]

for fname in sorted(files):
    txt = open(fname, encoding='utf-8').read()
    orig = txt

    # Remove ALL lines containing the hardcoded keys
    lines = txt.split('\n')
    lines = [l for l in lines if SB not in l and SK not in l]
    txt = '\n'.join(lines)

    # Remove any existing config.js tags (prevent duplicates)
    txt = txt.replace(TAG, '')

    # Find first <script tag in body and inject config.js before it
    # This handles both <script> and <script src=...>
    match = re.search(r'<script[\s>]', txt)
    if match:
        pos = match.start()
        txt = txt[:pos] + TAG + '\n' + txt[pos:]

    if txt != orig:
        open(fname, 'w', encoding='utf-8').write(txt)
        print('fixed:', fname)
    else:
        print('skip:', fname)

print('all done')
