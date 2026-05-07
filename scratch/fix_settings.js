import fs from 'fs';

const filePath = 'f:/CURSOR/fincontrol/src/pages/Settings.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const target = `                        </div>
                      </div>
                    </div>
                  </div>
                )}`;

const replacement = `                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}`;

// This is too specific. Let's just use the line numbers from view_file.
const lines = content.split('\n');

// Line 2541 in view_file (1-indexed) is index 2540.
// Let's check the content there.
console.log('Line 2540:', lines[2539]);
console.log('Line 2541:', lines[2540]);
console.log('Line 2542:', lines[2541]);
console.log('Line 2543:', lines[2542]);
console.log('Line 2544:', lines[2543]);
console.log('Line 2545:', lines[2544]);

// Replace lines 2543-2545 (indices 2542-2544) with the correct closing tags.
// Wait, indices:
// 2540: lines[2539] -> </div>
// 2541: lines[2540] -> </div>
// 2542: lines[2541] -> </div>
// 2543: lines[2542] -> </div>
// 2544: lines[2543] -> </div>
// 2545: lines[2544] -> )}

lines.splice(2542, 3, 
  '                    </div>',
  '                  </div>',
  '                </div>',
  '              </div>',
  '            )}'
);

fs.writeFileSync(filePath, lines.join('\n'));
