@echo off

call setup.bat

set COMPILATION_LEVEL=SIMPLE_OPTIMIZATIONS
set CLOSURE_LIBRARY=..\external\closure-library
set COMPILER_JAR=..\external\closure\compiler.jar

if not exist ..\compiled mkdir ..\compiled

%PYTHON% %CLOSURE_LIBRARY%\closure\bin\build\depswriter.py ^
 --output_file=..\compiled\deps_editor.js ^
 --root_with_prefix="%CLOSURE_LIBRARY%\closure\ ../" ^
 --root_with_prefix="..\source\ ../../../../source" ^
 --root_with_prefix="..\..\WebViewer\source\ ../../../../../WebViewer/source"

%PYTHON% %CLOSURE_LIBRARY%\closure\bin\build\closurebuilder.py ^
 --compiler_flags=--compilation_level=%COMPILATION_LEVEL% ^
 --compiler_flags=--create_source_map=..\compiled\ggedit-optimized.map ^
 --compiler_flags=--externs=..\source\externs\jquery_externs.js ^
 --compiler_flags=--externs=..\source\externs\kinetic_externs.js ^
 --compiler_flags=--externs=..\source\externs\webgl_fixes.js ^
 --compiler_flags=--formatting=PRETTY_PRINT^
 --compiler_flags=--warning_level=VERBOSE ^
 --compiler_jar=%COMPILER_JAR% ^
 --namespace=owg.gg.Editor ^
 --namespace=owg.gg.GlobeGame ^
 --namespace=owg.OpenWebGlobe ^
 --output_file=..\compiled\ggedit-optimized.js ^
 --output_mode=compiled ^
 --root=..\external\closure-library\ ^
 --root=..\source\ ^
 --root=..\..\WebViewer\source\