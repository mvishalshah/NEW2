const fs = require('fs');
let content = fs.readFileSync('src/components/ProfileView.tsx', 'utf-8');

if (!content.includes('monthlyLimits')) {
  content = content.replace(
    "const [bio, setBio] = useState(currentUser?.bio || '');",
    "const [bio, setBio] = useState(currentUser?.bio || '');\n  const [monthlyLimits, setMonthlyLimits] = useState<Record<string, number>>(currentUser?.monthlyLimits || {});"
  );
  
  content = content.replace(
    "setBio(currentUser.bio || '');",
    "setBio(currentUser.bio || '');\n      setMonthlyLimits(currentUser.monthlyLimits || {});"
  );
  
  content = content.replace(
    "bio",
    "bio, monthlyLimits"
  ); // We need to be careful with this global replace. Let's do it in handleSaveProfile.
  
  const handleSaveProfileSearch = `    const ok = await updateProfile({
      name: name.trim(),
      username: username.trim(),
      institution: institution.trim(),
      course: course.trim(),
      yearOfStudy: yearOfStudy.trim(),
      year: yearOfStudy.trim(), // fallback for older schema
      address: address.trim(),
      city: city.trim(),
      phone: phone.trim(),
      upiId: upiId.trim(),
      bio: bio.trim()
    });`;
    
  const handleSaveProfileReplace = `    const ok = await updateProfile({
      name: name.trim(),
      username: username.trim(),
      institution: institution.trim(),
      course: course.trim(),
      yearOfStudy: yearOfStudy.trim(),
      year: yearOfStudy.trim(), // fallback for older schema
      address: address.trim(),
      city: city.trim(),
      phone: phone.trim(),
      upiId: upiId.trim(),
      bio: bio.trim(),
      monthlyLimits
    });`;
    
  content = content.replace(handleSaveProfileSearch, handleSaveProfileReplace);
}

const uiLimitsView = `
        {/* Spending Limits Read-Only View */}
        {currentUser?.monthlyLimits && Object.keys(currentUser.monthlyLimits).length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 text-xs">
            <span className="text-slate-400 block text-[11px] mb-2">Monthly Spending Limits:</span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(currentUser.monthlyLimits).map(([cat, limit]) => (
                <span key={cat} className="bg-white/10 px-2 py-1 rounded-md text-slate-200">
                  {cat}: ₹{limit}
                </span>
              ))}
            </div>
          </div>
        )}
`;

if (!content.includes('Monthly Spending Limits:')) {
  content = content.replace("</div>\n      {/* Edit Profile Form */}", uiLimitsView + "      </div>\n      {/* Edit Profile Form */}");
}

const uiLimitsEdit = `
            {/* Monthly Spending Limits */}
            <div className="sm:col-span-2 mt-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                Monthly Spending Limits (Per Category)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['Food', 'Transport', 'Education', 'Shopping', 'Entertainment', 'Hostel', 'Other'].map(cat => (
                  <div key={cat} className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">{cat.substring(0, 3)}</span>
                    <input
                      type="number"
                      placeholder="No limit"
                      value={monthlyLimits[cat] || ''}
                      onChange={(e) => setMonthlyLimits(prev => ({ ...prev, [cat]: Number(e.target.value) || 0 }))}
                      className="w-full pl-12 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
`;

if (!content.includes('Monthly Spending Limits (Per Category)')) {
  content = content.replace("          <div className=\"flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800\">", uiLimitsEdit + "\n          <div className=\"flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800\">");
}

fs.writeFileSync('src/components/ProfileView.tsx', content);
