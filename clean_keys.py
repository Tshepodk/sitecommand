import os
files = [f for f in os.listdir('.') if f.endswith('.html')]
for f in files:
    lines = open(f).readlines()
    clean = [l for l in lines if 'dovdqmzyfgmkxvqdaeyr' not in l and 'sb_publishable' not in l]
    if len(clean) != len(lines):
        open(f,'w').writelines(clean)
        print('fixed:', f, '-', len(lines)-len(clean), 'lines removed')
    else:
        print('ok:', f)
