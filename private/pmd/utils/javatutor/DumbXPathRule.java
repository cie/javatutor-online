package javatutor;

import java.util.Arrays;
import java.util.List;
import net.sourceforge.pmd.lang.rule.XPathRule;

/**
 * Disables the ruleChain optimization because it causes semantic misbehaviors for advanced
 * xpaths (e.g. those using following-sibling::)
 */
public class DumbXPathRule extends XPathRule {

  @Override
  public List<String> getRuleChainVisits() {
    return Arrays.asList();
  }
}
